import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getSessionFromCookie } from '@/lib/auth';

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getSessionFromCookie();
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'Yetkisiz erişim.' }, { status: 403 });
  }

  const { id } = await params;
  const { verified } = await request.json();
  const db = await getDb();

  await db.execute({
    sql: "UPDATE reports SET verified = ? WHERE id = ?",
    args: [verified ? 1 : 0, id],
  });

  return NextResponse.json({ success: true });
}
