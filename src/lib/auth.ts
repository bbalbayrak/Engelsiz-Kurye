import { getDb } from './db';
import bcrypt from 'bcryptjs';
import { v4 as uuid } from 'uuid';
import { cookies } from 'next/headers';

const SESSION_COOKIE = 'engelsiz_session';
const SESSION_DAYS = 30;

// ── Password ──
export function hashPassword(password: string): string {
  return bcrypt.hashSync(password, 10);
}

export function verifyPassword(password: string, hash: string): boolean {
  return bcrypt.compareSync(password, hash);
}

// ── Users ──
export async function createUser(name: string, email: string, password: string, role: string = 'courier') {
  const db = await getDb();
  const id = uuid();
  const passwordHash = hashPassword(password);
  try {
    await db.execute({
      sql: 'INSERT INTO users (id, name, email, password_hash, role) VALUES (?, ?, ?, ?, ?)',
      args: [id, name, email.toLowerCase().trim(), passwordHash, role],
    });
    return { id, name, email: email.toLowerCase().trim(), role };
  } catch (err: unknown) {
    if (err instanceof Error && err.message.includes('UNIQUE')) {
      return null;
    }
    throw err;
  }
}

export async function getUserByEmail(email: string) {
  const db = await getDb();
  const res = await db.execute({ sql: 'SELECT * FROM users WHERE email = ?', args: [email.toLowerCase().trim()] });
  if (res.rows.length === 0) return undefined;
  const r = res.rows[0];
  return { id: r.id as string, name: r.name as string, email: r.email as string, password_hash: r.password_hash as string, role: r.role as string, created_at: r.created_at as string };
}

export async function getUserById(id: string) {
  const db = await getDb();
  const res = await db.execute({ sql: 'SELECT id, name, email, role, created_at FROM users WHERE id = ?', args: [id] });
  if (res.rows.length === 0) return undefined;
  const r = res.rows[0];
  return { id: r.id as string, name: r.name as string, email: r.email as string, role: r.role as string, created_at: r.created_at as string };
}

// ── Sessions ──
export async function createSession(userId: string): Promise<string> {
  const db = await getDb();
  const token = uuid();
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000).toISOString();
  await db.execute({ sql: 'INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, ?)', args: [token, userId, expiresAt] });
  return token;
}

export async function getSessionUser(token: string) {
  const db = await getDb();
  const res = await db.execute({
    sql: `SELECT s.user_id, u.name, u.email, u.role
          FROM sessions s JOIN users u ON s.user_id = u.id
          WHERE s.id = ? AND s.expires_at > datetime('now')`,
    args: [token],
  });
  if (res.rows.length === 0) return null;
  const r = res.rows[0];
  return { id: r.user_id as string, name: r.name as string, email: r.email as string, role: r.role as string };
}

export async function deleteSession(token: string) {
  const db = await getDb();
  await db.execute({ sql: 'DELETE FROM sessions WHERE id = ?', args: [token] });
}

export async function cleanExpiredSessions() {
  const db = await getDb();
  await db.execute("DELETE FROM sessions WHERE expires_at <= datetime('now')");
}

// ── Cookie helpers ──
export async function setSessionCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_DAYS * 24 * 60 * 60,
  });
}

export async function getSessionFromCookie() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return getSessionUser(token);
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (token) await deleteSession(token);
  cookieStore.delete(SESSION_COOKIE);
}
