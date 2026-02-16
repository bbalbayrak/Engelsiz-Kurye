import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

// Public: get all visible sections
export async function GET() {
  const db = getDb();
  const rows = db.prepare('SELECT key, page, label, visible, content FROM site_sections ORDER BY page, key').all() as Array<{
    key: string; page: string; label: string; visible: number; content: string;
  }>;

  const sections: Record<string, { visible: boolean; content: Record<string, unknown> }> = {};
  for (const row of rows) {
    sections[row.key] = {
      visible: row.visible === 1,
      content: JSON.parse(row.content),
    };
  }

  return NextResponse.json({ success: true, sections });
}
