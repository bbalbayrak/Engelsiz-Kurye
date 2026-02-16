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
export function createUser(name: string, email: string, password: string, role: string = 'courier') {
  const db = getDb();
  const id = uuid();
  const passwordHash = hashPassword(password);
  try {
    db.prepare('INSERT INTO users (id, name, email, password_hash, role) VALUES (?, ?, ?, ?, ?)')
      .run(id, name, email.toLowerCase().trim(), passwordHash, role);
    return { id, name, email: email.toLowerCase().trim(), role };
  } catch (err: unknown) {
    if (err instanceof Error && err.message.includes('UNIQUE constraint failed')) {
      return null; // email already exists
    }
    throw err;
  }
}

export function getUserByEmail(email: string) {
  const db = getDb();
  return db.prepare('SELECT * FROM users WHERE email = ?').get(email.toLowerCase().trim()) as {
    id: string; name: string; email: string; password_hash: string; role: string; created_at: string;
  } | undefined;
}

export function getUserById(id: string) {
  const db = getDb();
  return db.prepare('SELECT id, name, email, role, created_at FROM users WHERE id = ?').get(id) as {
    id: string; name: string; email: string; role: string; created_at: string;
  } | undefined;
}

// ── Sessions ──
export function createSession(userId: string): string {
  const db = getDb();
  const token = uuid();
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000).toISOString();
  db.prepare('INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, ?)').run(token, userId, expiresAt);
  return token;
}

export function getSessionUser(token: string) {
  const db = getDb();
  const session = db.prepare(`
    SELECT s.user_id, s.expires_at, u.id, u.name, u.email, u.role
    FROM sessions s JOIN users u ON s.user_id = u.id
    WHERE s.id = ? AND s.expires_at > datetime('now')
  `).get(token) as { user_id: string; name: string; email: string; role: string } | undefined;
  return session ? { id: session.user_id, name: session.name, email: session.email, role: session.role } : null;
}

export function deleteSession(token: string) {
  const db = getDb();
  db.prepare('DELETE FROM sessions WHERE id = ?').run(token);
}

export function cleanExpiredSessions() {
  const db = getDb();
  db.prepare("DELETE FROM sessions WHERE expires_at <= datetime('now')").run();
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
  if (token) deleteSession(token);
  cookieStore.delete(SESSION_COOKIE);
}
