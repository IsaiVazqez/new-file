import { getDb } from '../../config/database';

export interface User {
  id: number;
  email: string;
  password: string;
  refresh_token: string | null;
  created_at: string;
}

export function findByEmail(email: string): User | undefined {
  return getDb().prepare('SELECT * FROM users WHERE email = ?').get(email) as User | undefined;
}

export function updateRefreshToken(id: number, token: string | null): void {
  getDb().prepare('UPDATE users SET refresh_token = ? WHERE id = ?').run(token, id);
}

export function findByRefreshToken(token: string): User | undefined {
  return getDb().prepare('SELECT * FROM users WHERE refresh_token = ?').get(token) as User | undefined;
}

export function createUser(email: string, hashedPassword: string): unknown {
  return getDb()
    .prepare('INSERT INTO users (email, password) VALUES (?, ?)')
    .run(email, hashedPassword);
}
