import { Router, type Request, type Response } from 'express';
import crypto from 'crypto';
import { requireAuth } from '../middleware/auth';
import { db } from '../db';
import { users } from '../db/schema';
import { eq } from 'drizzle-orm';
import { logger } from '../utils/logger';

const router = Router();

function getRazorpay() {
  const Razorpay = require('razorpay');
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
}

router.post('/subscribe/create', requireAuth, async (req: Request, res: Response) => {
  try {
    const razorpay = getRazorpay();
    const planId = process.env.RAZORPAY_PLAN_ID;

    if (!planId) {
      res.status(500).json({ error: 'Payment not configured' });
      return;
    }

    const subscription = await razorpay.subscriptions.create({
      plan_id: planId,
      total_count: 12,
      quantity: 1,
      customer_notify: 1,
      notes: {
        userId: req.user!.userId,
        email: req.user!.email,
      },
    });

    logger.info('Subscription created', { userId: req.user!.userId, subscriptionId: subscription.id });
    res.json({ subscriptionId: subscription.id });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Subscription creation failed';
    logger.error('Subscription create error', { error: msg });
    res.status(500).json({ error: 'Could not create subscription. Please try again.' });
  }
});

router.post('/subscribe/verify', requireAuth, async (req: Request, res: Response) => {
  const { razorpay_subscription_id, razorpay_payment_id, razorpay_signature } = req.body;

  if (!razorpay_subscription_id || !razorpay_payment_id || !razorpay_signature) {
    res.status(400).json({ error: 'Missing payment verification data' });
    return;
  }

  try {
    const expectedSig = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(`${razorpay_payment_id}|${razorpay_subscription_id}`)
      .digest('hex');

    if (expectedSig !== razorpay_signature) {
      logger.warn('Invalid payment signature', { userId: req.user!.userId });
      res.status(400).json({ error: 'Payment verification failed' });
      return;
    }

    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    await db.update(users).set({
      subscriptionStatus: 'active',
      subscriptionExpiresAt: expiresAt,
      razorpaySubscriptionId: razorpay_subscription_id,
      updatedAt: new Date(),
    }).where(eq(users.id, req.user!.userId));

    logger.info('Subscription activated', { userId: req.user!.userId });

    const rows = await db.select().from(users).where(eq(users.id, req.user!.userId)).limit(1);
    const user = rows[0];

    res.json({
      success: true,
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
    const msg = err instanceof Error ? err.message : 'Verification failed';
    logger.error('Payment verify error', { error: msg });
    res.status(500).json({ error: 'Payment verification failed' });
  }
});

router.post('/subscribe/webhook', async (req: Request, res: Response) => {
  const signature = req.headers['x-razorpay-signature'] as string;
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

  if (!webhookSecret || !signature) {
    res.status(400).json({ error: 'Missing webhook configuration' });
    return;
  }

  try {
    const body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
    const expectedSig = crypto
      .createHmac('sha256', webhookSecret)
      .update(body)
      .digest('hex');

    if (expectedSig !== signature) {
      res.status(400).json({ error: 'Invalid signature' });
      return;
    }

    const event = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const eventType = event.event;
    const subscriptionId = event.payload?.subscription?.entity?.id;

    if (!subscriptionId) {
      res.json({ received: true });
      return;
    }

    const rows = await db.select().from(users)
      .where(eq(users.razorpaySubscriptionId, subscriptionId)).limit(1);

    if (!rows.length) {
      logger.warn('Webhook: user not found for subscription', { subscriptionId });
      res.json({ received: true });
      return;
    }

    const user = rows[0];

    if (eventType === 'subscription.charged') {
      await db.update(users).set({
        subscriptionStatus: 'active',
        subscriptionExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(),
      }).where(eq(users.id, user.id));
      logger.info('Subscription renewed', { userId: user.id });
    } else if (eventType === 'subscription.cancelled' || eventType === 'subscription.expired') {
      await db.update(users).set({
        subscriptionStatus: eventType === 'subscription.cancelled' ? 'cancelled' : 'expired',
        updatedAt: new Date(),
      }).where(eq(users.id, user.id));
      logger.info('Subscription ended', { userId: user.id, event: eventType });
    }

    res.json({ received: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Webhook error';
    logger.error('Webhook error', { error: msg });
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

export default router;
