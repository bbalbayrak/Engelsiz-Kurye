import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getSessionFromCookie } from '@/lib/auth';

// Admin: get all sections with metadata
export async function GET() {
  const user = await getSessionFromCookie();
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'Yetkisiz erişim.' }, { status: 403 });
  }

  const db = await getDb();
  const res = await db.execute('SELECT key, page, label, visible, content, updated_at FROM site_sections ORDER BY page, key');

  const sections = res.rows.map(r => ({
    key: r.key,
    page: r.page,
    label: r.label,
    visible: r.visible === 1,
    content: JSON.parse(r.content as string),
    updatedAt: r.updated_at,
  }));

  return NextResponse.json({ success: true, sections });
}
