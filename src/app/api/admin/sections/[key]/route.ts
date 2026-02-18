import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getSessionFromCookie } from '@/lib/auth';

// Admin: update section visibility + content
export async function PUT(request: NextRequest, { params }: { params: Promise<{ key: string }> }) {
  const user = await getSessionFromCookie();
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'Yetkisiz erişim.' }, { status: 403 });
  }

  const { key } = await params;
  const body = await request.json();
  const db = await getDb();

  const existing = await db.execute({ sql: 'SELECT key FROM site_sections WHERE key = ?', args: [key] });
  if (existing.rows.length === 0) {
    return NextResponse.json({ error: 'Bölüm bulunamadı.' }, { status: 404 });
  }

  if (typeof body.visible === 'boolean') {
    await db.execute({
      sql: "UPDATE site_sections SET visible = ?, updated_at = datetime('now') WHERE key = ?",
      args: [body.visible ? 1 : 0, key],
    });
  }

  if (body.content && typeof body.content === 'object') {
    await db.execute({
      sql: "UPDATE site_sections SET content = ?, updated_at = datetime('now') WHERE key = ?",
      args: [JSON.stringify(body.content), key],
    });
  }

  const updated = await db.execute({ sql: 'SELECT key, page, label, visible, content, updated_at FROM site_sections WHERE key = ?', args: [key] });
  const r = updated.rows[0];

  return NextResponse.json({
    success: true,
    section: {
      key: r.key,
      page: r.page,
      label: r.label,
      visible: r.visible === 1,
      content: JSON.parse(r.content as string),
      updatedAt: r.updated_at,
    },
  });
}
