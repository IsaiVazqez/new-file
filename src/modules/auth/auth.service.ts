import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import env from '../../config/env';
import * as repo from './auth.repository';
import { AppError } from '../../shared/errors';
import { User } from './auth.repository';

function generateAccessToken(user: User): string {
  return jwt.sign({ id: user.id, email: user.email }, env.JWT_SECRET, { expiresIn: '15m' });
}

function generateRefreshToken(user: User): string {
  return jwt.sign({ id: user.id }, env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
}

export async function login(email: string, password: string): Promise<{ accessToken: string; refreshToken: string }> {
  const user = repo.findByEmail(email);
  if (!user) throw new AppError('Invalid credentials', 401);

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw new AppError('Invalid credentials', 401);

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);
  repo.updateRefreshToken(user.id, refreshToken);

  return { accessToken, refreshToken };
}

export function refresh(token: string): { accessToken: string } {
  if (!token) throw new AppError('Refresh token required', 400);

  const user = repo.findByRefreshToken(token);
  if (!user) throw new AppError('Invalid refresh token', 401);

  try {
    jwt.verify(token, env.JWT_REFRESH_SECRET);
  } catch {
    repo.updateRefreshToken(user.id, null);
    throw new AppError('Refresh token expired', 401);
  }

  const accessToken = generateAccessToken(user);
  return { accessToken };
}

export function logout(token: string): void {
  if (!token) return;
  const user = repo.findByRefreshToken(token);
  if (user) repo.updateRefreshToken(user.id, null);
}

export async function seedAdmin(): Promise<void> {
  const existing = repo.findByEmail(env.ADMIN_EMAIL);
  if (existing) return;
  const hashed = await bcrypt.hash(env.ADMIN_PASSWORD, 12);
  repo.createUser(env.ADMIN_EMAIL, hashed);
  console.log(`  ✓ Admin user seeded: ${env.ADMIN_EMAIL}`);
}
