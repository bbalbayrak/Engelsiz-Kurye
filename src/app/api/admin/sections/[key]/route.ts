import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getSessionFromCookie } from '@/lib/auth';

// Admin: update section visibility + content
export async function PUT(request: NextRequest, { params }: { params: Promise<{ key: string }> }) {
  const user = await getSessionFromCookie();
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'Yetkisiz erisim.' }, { status: 403 });
  }

  const { key } = await params;
  const body = await request.json();
  const db = getDb();

  const existing = db.prepare('SELECT key FROM site_sections WHERE key = ?').get(key);
  if (!existing) {
    return NextResponse.json({ error: 'Bolum bulunamadi.' }, { status: 404 });
  }

  // Update visibility if provided
  if (typeof body.visible === 'boolean') {
    db.prepare("UPDATE site_sections SET visible = ?, updated_at = datetime('now') WHERE key = ?")
      .run(body.visible ? 1 : 0, key);
  }

  // Update content if provided
  if (body.content && typeof body.content === 'object') {
    db.prepare("UPDATE site_sections SET content = ?, updated_at = datetime('now') WHERE key = ?")
      .run(JSON.stringify(body.content), key);
  }

  const updated = db.prepare('SELECT key, page, label, visible, content, updated_at FROM site_sections WHERE key = ?').get(key) as {
    key: string; page: string; label: string; visible: number; content: string; updated_at: string;
  };

  return NextResponse.json({
    success: true,
    section: {
      key: updated.key,
      page: updated.page,
      label: updated.label,
      visible: updated.visible === 1,
      content: JSON.parse(updated.content),
      updatedAt: updated.updated_at,
    },
  });
}
