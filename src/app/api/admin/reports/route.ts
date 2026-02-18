import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getSessionFromCookie } from '@/lib/auth';

export async function GET() {
  const user = await getSessionFromCookie();
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'Yetkisiz erişim.' }, { status: 403 });
  }

  const db = await getDb();
  const res = await db.execute(
    `SELECT id, user_email, site_name, city, district, obstacle_type, description, reported_at, verified, report_count
     FROM reports ORDER BY reported_at DESC`
  );

  const reports = res.rows.map(r => ({
    id: r.id,
    userEmail: r.user_email,
    siteName: r.site_name,
    city: r.city,
    district: r.district,
    obstacleType: r.obstacle_type,
    description: r.description,
    reportedAt: r.reported_at,
    verified: r.verified === 1,
    reportCount: r.report_count,
  }));

  return NextResponse.json({ success: true, reports });
}
