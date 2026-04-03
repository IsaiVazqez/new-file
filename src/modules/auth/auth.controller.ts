import { Request, Response, NextFunction } from 'express';
import * as authService from './auth.service';
import { success } from '../../shared/response';
import { AppError } from '../../shared/errors';

export async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { email, password } = req.body;
    if (!email || !password) throw new AppError('Email and password are required', 400);
    const tokens = await authService.login(email, password);
    success(res, tokens);
  } catch (err) {
    next(err);
  }
}

export function refresh(req: Request, res: Response, next: NextFunction): void {
  try {
    const { refreshToken } = req.body;
    const data = authService.refresh(refreshToken);
    success(res, data);
  } catch (err) {
    next(err);
  }
}

export function logout(req: Request, res: Response, next: NextFunction): void {
  try {
    const { refreshToken } = req.body;
    authService.logout(refreshToken);
    success(res, null);
  } catch (err) {
    next(err);
  }
}
