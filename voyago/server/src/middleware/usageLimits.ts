import type { Request, Response, NextFunction } from 'express';
import { db } from '../db';
import { users } from '../db/schema';
import { eq } from 'drizzle-orm';

const FREE_GENERATION_LIMIT = 2;
const FREE_CUSTOMIZATION_LIMIT = 1;

async function getUser(userId: string) {
  const rows = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  return rows[0] ?? null;
}

function isPremium(user: { subscriptionStatus: string; subscriptionExpiresAt: Date | null }): boolean {
  if (user.subscriptionStatus !== 'active') return false;
  if (!user.subscriptionExpiresAt) return false;
  return user.subscriptionExpiresAt.getTime() > Date.now();
}

export async function checkGenerationLimit(req: Request, res: Response, next: NextFunction): Promise<void> {
  const user = await getUser(req.user!.userId);
  if (!user) { res.status(401).json({ error: 'User not found' }); return; }

  if (isPremium(user)) return next();

  if (user.generationsUsed >= FREE_GENERATION_LIMIT) {
    res.status(403).json({
      error: 'generation_limit_reached',
      message: `You've used all ${FREE_GENERATION_LIMIT} free generations. Upgrade to Premium for unlimited access.`,
      upgradeRequired: true,
      used: user.generationsUsed,
      limit: FREE_GENERATION_LIMIT,
    });
    return;
  }
  next();
}

export async function checkCustomizationLimit(req: Request, res: Response, next: NextFunction): Promise<void> {
  const user = await getUser(req.user!.userId);
  if (!user) { res.status(401).json({ error: 'User not found' }); return; }

  if (isPremium(user)) return next();

  if (user.customizationsUsed >= FREE_CUSTOMIZATION_LIMIT) {
    res.status(403).json({
      error: 'customization_limit_reached',
      message: `You've used your free customization. Upgrade to Premium for unlimited access.`,
      upgradeRequired: true,
      used: user.customizationsUsed,
      limit: FREE_CUSTOMIZATION_LIMIT,
    });
    return;
  }
  next();
}

export async function incrementGeneration(userId: string): Promise<void> {
  const user = await getUser(userId);
  if (!user) return;
  await db.update(users).set({
    generationsUsed: user.generationsUsed + 1,
    updatedAt: new Date(),
  }).where(eq(users.id, userId));
}

export async function incrementCustomization(userId: string): Promise<void> {
  const user = await getUser(userId);
  if (!user) return;
  await db.update(users).set({
    customizationsUsed: user.customizationsUsed + 1,
    updatedAt: new Date(),
  }).where(eq(users.id, userId));
}
