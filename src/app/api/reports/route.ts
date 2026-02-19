import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getSessionFromCookie } from '@/lib/auth';
import { v4 as uuid } from 'uuid';

// Geocode using OpenStreetMap Nominatim (free, no API key)
async function nominatimFetch(params: Record<string, string>): Promise<[number, number] | null> {
  try {
    const url = `https://nominatim.openstreetmap.org/search?${new URLSearchParams({ format: 'json', limit: '1', countrycodes: 'tr', ...params })}`;
    const res = await fetch(url, { headers: { 'User-Agent': 'EngelsizTeslimat/1.0' }, signal: AbortSignal.timeout(5000) });
    if (!res.ok) return null;
    const results = await res.json();
    if (results.length > 0) {
      const lat = parseFloat(results[0].lat);
      const lon = parseFloat(results[0].lon);
      if (!isNaN(lat) && !isNaN(lon)) return [lat, lon];
    }
  } catch { /* continue */ }
  return null;
}

async function geocode(
  siteName: string,
  buildingNo: string,
  street: string,
  neighborhood: string,
  district: string,
  city: string,
): Promise<[number, number] | null> {
  const streetPart = [buildingNo, street].filter(Boolean).join(' ');

  // Strategy 1: Nominatim structured query — most precise
  if (streetPart) {
    const result = await nominatimFetch({ street: streetPart, city, county: district });
    if (result) return result;
  }

  // Strategy 2: Free-text with all available address parts
  const parts = [
    streetPart,
    neighborhood ? `${neighborhood} Mahallesi` : '',
    district,
    city,
    'Turkey',
  ].filter(Boolean);
  if (parts.length > 3) {
    const result = await nominatimFetch({ q: parts.join(', ') });
    if (result) return result;
  }

  // Strategy 3: Site name + district + city
  const result3 = await nominatimFetch({ q: `${siteName}, ${district}, ${city}, Turkey` });
  if (result3) return result3;

  // Strategy 4: District + city (coarse fallback)
  return nominatimFetch({ q: `${district}, ${city}, Turkey` });
}

// GET — all reports
export async function GET() {
  const db = await getDb();

  // Verified reports only (for map pins)
  const res = await db.execute(
    `SELECT id, user_id, user_email, site_name, address, city, district,
            latitude, longitude, obstacle_type, description, reported_at, verified, report_count
     FROM reports WHERE verified = 1 ORDER BY reported_at DESC`
  );

  // Aggregate counts across all reports (for stats widget)
  const countRes = await db.execute(
    `SELECT
       COUNT(*) AS total,
       SUM(CASE WHEN verified = 1 THEN 1 ELSE 0 END) AS verified_count,
       SUM(CASE WHEN verified = 0 THEN 1 ELSE 0 END) AS pending_count
     FROM reports`
  );
  const row = countRes.rows[0];
  const counts = {
    total: Number(row.total ?? 0),
    verified: Number(row.verified_count ?? 0),
    pending: Number(row.pending_count ?? 0),
  };

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

  return NextResponse.json({ success: true, reports: data, total: data.length, counts });
}

// POST — create report
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { siteName, neighborhood, street, buildingNo, address, city, district, obstacleType, obstacleTypes, description, captchaAnswer, captchaExpected } = body;
    const resolvedType: string = Array.isArray(obstacleTypes) && obstacleTypes.length > 0
      ? obstacleTypes.join(',')
      : (obstacleType || '');

    if (!siteName || !city || !district || !resolvedType) {
      return NextResponse.json({ success: false, error: 'Tüm zorunlu alanları doldurun.' }, { status: 400 });
    }
    if (captchaAnswer !== captchaExpected) {
      return NextResponse.json({ success: false, error: 'Güvenlik sorusu yanlış.' }, { status: 400 });
    }

    // Build combined address string for storage
    const streetPart = [buildingNo, street].filter(Boolean).join(' ');
    const storedAddress = [streetPart, neighborhood ? `${neighborhood} Mah.` : ''].filter(Boolean).join(', ')
      || address || '';

    const user = await getSessionFromCookie();
    const coords = await geocode(siteName, buildingNo || '', street || '', neighborhood || '', district, city);
    const lat = coords ? coords[0] : 39 + Math.random() * 3;
    const lng = coords ? coords[1] : 28 + Math.random() * 8;

    const id = uuid();
    const db = await getDb();

    await db.execute({
      sql: `INSERT INTO reports (id, user_id, user_email, site_name, address, city, district, latitude, longitude, obstacle_type, description, verified, report_count)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 1)`,
      args: [id, user?.id || null, user?.email || null, siteName.trim(), storedAddress.trim(), city, district, lat, lng, resolvedType, (description || '').trim()],
    });

    return NextResponse.json({
      success: true,
      message: user ? `Bildiriminiz ${user.email} ile kaydedildi.` : 'Bildiriminiz anonim olarak kaydedildi.',
      reportId: id,
      anonymous: !user,
    });
  } catch (err) {
    console.error('Report creation error:', err);
    return NextResponse.json({ success: false, error: 'Sunucu hatası.' }, { status: 500 });
  }
}
