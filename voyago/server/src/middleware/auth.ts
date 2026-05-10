import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { logger } from '../utils/logger';

const JWT_SECRET = () => process.env.JWT_SECRET || 'voyago-dev-secret-change-in-prod';

interface JwtPayload {
  userId: string;
  email: string;
  name: string;
  subscriptionStatus: string;
}

export function attachUser(req: Request, _res: Response, next: NextFunction): void {
  const token = req.cookies?.voyago_token;
  if (!token) {
    req.user = null;
    return next();
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET()) as JwtPayload;
    req.user = decoded;
  } catch {
    req.user = null;
  }
  next();
}

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  if (!req.user) {
    res.status(401).json({ error: 'Authentication required', code: 'AUTH_REQUIRED' });
    return;
  }
  next();
}

export function signToken(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET(), { expiresIn: '7d' });
}

export function cookieOptions() {
  const isProd = process.env.NODE_ENV === 'production';
  return {
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax' as const,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/',
  };
}
