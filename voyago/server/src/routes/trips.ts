import { Router, type Request, type Response } from 'express';
import { body, param, validationResult } from 'express-validator';
import { db } from '../db';
import { trips } from '../db/schema';
import { eq } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';
import { requireAuth } from '../middleware/auth';
import { logger } from '../utils/logger';

const router = Router();

const saveTripRules = [
  body('destination').trim().notEmpty().isLength({ max: 100 }).escape(),
  body('origin').trim().notEmpty().isLength({ max: 100 }).escape(),
  body('travellers').trim().optional().isLength({ max: 50 }),
  body('budget').trim().optional().isLength({ max: 50 }),
  body('itinerary').notEmpty().withMessage('Itinerary data is required'),
];

router.post('/trips/save', requireAuth, saveTripRules, async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  try {
    const { destination, origin, dates, travellers, budget, preferences, constraints, itinerary } = req.body;
    const id = uuidv4();

    await db.insert(trips).values({
      id,
      userId: req.user!.userId,
      destination,
      origin,
      dates: dates ?? 'Flexible',
      travellers: travellers ?? '2 Adults',
      budget: budget ?? 'Mid-range',
      preferences: JSON.stringify(Array.isArray(preferences) ? preferences : []),
      constraints: constraints ?? '',
      itinerary: JSON.stringify(itinerary),
      createdAt: new Date(),
    });

    logger.info('Trip saved', { id, destination });
    res.json({ id, message: 'Trip saved successfully' });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Save failed';
    logger.error('Trip save error', { error: msg });
    res.status(500).json({ error: 'Could not save trip — please try again.' });
  }
});

router.get(
  '/trips/:id',
  [param('id').isUUID().withMessage('Invalid trip ID')],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    try {
      const result = await db.select().from(trips).where(eq(trips.id, req.params.id)).limit(1);
      if (!result.length) {
        res.status(404).json({ error: 'Trip not found' });
        return;
      }
      const t = result[0];
      res.json({
        ...t,
        preferences: JSON.parse(t.preferences),
        itinerary: JSON.parse(t.itinerary),
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Fetch failed';
      logger.error('Trip fetch error', { error: msg });
      res.status(500).json({ error: 'Could not retrieve trip — please try again.' });
    }
  },
);

export default router;
