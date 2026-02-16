import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

// Public: get all sections with visibility
export async function GET() {
  const db = await getDb();
  const res = await db.execute('SELECT key, page, label, visible, content FROM site_sections ORDER BY page, key');

  const sections: Record<string, { visible: boolean; content: Record<string, unknown> }> = {};
  for (const row of res.rows) {
    sections[row.key as string] = {
      visible: row.visible === 1,
      content: JSON.parse(row.content as string),
    };
  }

  return NextResponse.json({ success: true, sections });
}
