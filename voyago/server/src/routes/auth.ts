import { Router, type Request, type Response } from 'express';
import { OAuth2Client } from 'google-auth-library';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../db';
import { users } from '../db/schema';
import { eq } from 'drizzle-orm';
import { signToken, cookieOptions, requireAuth } from '../middleware/auth';
import { logger } from '../utils/logger';

const router = Router();

function getOAuthClient() {
  return new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
}

router.post('/auth/google', async (req: Request, res: Response) => {
  const { credential } = req.body;
  if (!credential) {
    res.status(400).json({ error: 'Missing credential token' });
    return;
  }

  try {
    const client = getOAuthClient();
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload || !payload.sub || !payload.email) {
      res.status(400).json({ error: 'Invalid token payload' });
      return;
    }

    const { sub: googleId, email, name, picture } = payload;
    const now = new Date();

    const existing = await db.select().from(users).where(eq(users.googleId, googleId)).limit(1);

    let user;
    if (existing.length > 0) {
      user = existing[0];
      await db.update(users).set({
        name: name || user.name,
        avatarUrl: picture || user.avatarUrl,
        updatedAt: now,
      }).where(eq(users.id, user.id));
      user = { ...user, name: name || user.name, avatarUrl: picture || user.avatarUrl };
    } else {
      const id = uuidv4();
      user = {
        id,
        googleId,
        email: email!,
        name: name || 'Traveller',
        avatarUrl: picture || null,
        generationsUsed: 0,
        customizationsUsed: 0,
        subscriptionStatus: 'free',
        subscriptionExpiresAt: null,
        razorpaySubscriptionId: null,
        razorpayCustomerId: null,
        createdAt: now,
        updatedAt: now,
      };
      await db.insert(users).values(user);
      logger.info('New user registered', { userId: id, email });
    }

    const token = signToken({
      userId: user.id,
      email: user.email,
      name: user.name,
      subscriptionStatus: user.subscriptionStatus,
    });

    res.cookie('voyago_token', token, cookieOptions());
    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatarUrl: user.avatarUrl,
        generationsUsed: user.generationsUsed,
        customizationsUsed: user.customizationsUsed,
        subscriptionStatus: user.subscriptionStatus,
        subscriptionExpiresAt: user.subscriptionExpiresAt,
      },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Authentication failed';
    logger.error('Google auth failed', { error: msg });
    res.status(401).json({ error: 'Authentication failed. Please try again.' });
  }
});

router.get('/auth/me', requireAuth, async (req: Request, res: Response) => {
  try {
    const rows = await db.select().from(users).where(eq(users.id, req.user!.userId)).limit(1);
    if (!rows.length) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const user = rows[0];
    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatarUrl: user.avatarUrl,
        generationsUsed: user.generationsUsed,
        customizationsUsed: user.customizationsUsed,
        subscriptionStatus: user.subscriptionStatus,
        subscriptionExpiresAt: user.subscriptionExpiresAt,
      },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Failed to fetch user';
    logger.error('Auth me error', { error: msg });
    res.status(500).json({ error: 'Failed to fetch user data' });
  }
});

router.post('/auth/logout', (_req: Request, res: Response) => {
  res.clearCookie('voyago_token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  });
  res.json({ success: true });
});

export default router;
