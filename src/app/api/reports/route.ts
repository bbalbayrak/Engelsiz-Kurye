import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getSessionFromCookie } from '@/lib/auth';
import { v4 as uuid } from 'uuid';

// Geocode using OpenStreetMap Nominatim (free, no API key)
async function geocode(siteName: string, address: string, district: string, city: string): Promise<[number, number] | null> {
  const queries = [
    address ? `${address}, ${district}, ${city}, Turkey` : null,
    `${siteName}, ${district}, ${city}, Turkey`,
    `${district}, ${city}, Turkey`,
  ].filter(Boolean) as string[];

  for (const q of queries) {
    try {
      const url = `https://nominatim.openstreetmap.org/search?${new URLSearchParams({
        q, format: 'json', limit: '1', countrycodes: 'tr',
      })}`;
      const res = await fetch(url, {
        headers: { 'User-Agent': 'EngelsizTeslimat/1.0' },
        signal: AbortSignal.timeout(5000),
      });
      if (!res.ok) continue;
      const results = await res.json();
      if (results.length > 0) {
        const lat = parseFloat(results[0].lat);
        const lon = parseFloat(results[0].lon);
        if (!isNaN(lat) && !isNaN(lon)) return [lat, lon];
      }
    } catch { continue; }
  }
  return null;
}

// GET — all reports
export async function GET() {
  const db = await getDb();
  const res = await db.execute(
    `SELECT id, user_id, user_email, site_name, address, city, district,
            latitude, longitude, obstacle_type, description, reported_at, verified, report_count
     FROM reports ORDER BY reported_at DESC`
  );

  const data = res.rows.map(r => ({
    id: r.id,
    siteName: r.site_name,
    address: r.address,
    city: r.city,
    district: r.district,
    latitude: r.latitude as number,
    longitude: r.longitude as number,
    obstacleType: r.obstacle_type,
    description: r.description,
    reportedAt: r.reported_at,
    verified: r.verified === 1,
    reportCount: r.report_count,
    anonymous: !r.user_id,
  }));

  return NextResponse.json({ success: true, reports: data, total: data.length });
}

// POST — create report
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { siteName, address, city, district, obstacleType, description, captchaAnswer, captchaExpected } = body;

    if (!siteName || !city || !district || !obstacleType) {
      return NextResponse.json({ success: false, error: 'Tum zorunlu alanlari doldurun.' }, { status: 400 });
    }
    if (captchaAnswer !== captchaExpected) {
      return NextResponse.json({ success: false, error: 'Guvenlik sorusu yanlis.' }, { status: 400 });
    }

    const user = await getSessionFromCookie();
    const coords = await geocode(siteName, address || '', district, city);
    const lat = coords ? coords[0] : 39 + Math.random() * 3;
    const lng = coords ? coords[1] : 28 + Math.random() * 8;

    const id = uuid();
    const db = await getDb();

    await db.execute({
      sql: `INSERT INTO reports (id, user_id, user_email, site_name, address, city, district, latitude, longitude, obstacle_type, description, verified, report_count)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 1)`,
      args: [id, user?.id || null, user?.email || null, siteName.trim(), (address || '').trim(), city, district, lat, lng, obstacleType, (description || '').trim()],
    });

    return NextResponse.json({
      success: true,
      message: user ? `Bildiriminiz ${user.email} ile kaydedildi.` : 'Bildiriminiz anonim olarak kaydedildi.',
      reportId: id,
      anonymous: !user,
    });
  } catch (err) {
    console.error('Report creation error:', err);
    return NextResponse.json({ success: false, error: 'Sunucu hatasi.' }, { status: 500 });
  }
}
