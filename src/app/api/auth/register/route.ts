import { NextRequest, NextResponse } from 'next/server';
import { createUser, createSession, setSessionCookie } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, role } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Tum zorunlu alanlari doldurun.' }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ error: 'Sifre en az 6 karakter olmalidir.' }, { status: 400 });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Gecerli bir e-posta adresi girin.' }, { status: 400 });
    }

    const user = await createUser(name.trim(), email, password, role || 'courier');
    if (!user) {
      return NextResponse.json({ error: 'Bu e-posta adresi zaten kayitli.' }, { status: 409 });
    }

    const token = await createSession(user.id);
    await setSessionCookie(token);

    return NextResponse.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch {
    return NextResponse.json({ error: 'Sunucu hatasi.' }, { status: 500 });
  }
}
