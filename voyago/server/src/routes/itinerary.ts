import { Router, type Request, type Response } from 'express';
import { body, validationResult } from 'express-validator';
import { generateItinerary, refineItinerary, addDayTrip } from '../services/claudeService';
import { openSSE, sendChunk, sendDone, sendError } from '../utils/sse';
import { logger } from '../utils/logger';

const router = Router();

const destinationRules = [
  body('destination').trim().notEmpty().withMessage('Destination is required').isLength({ max: 100 }).escape(),
  body('origin').trim().notEmpty().withMessage('Origin is required').isLength({ max: 100 }).escape(),
  body('travellers').trim().optional().isLength({ max: 50 }),
  body('budget').trim().optional().isLength({ max: 50 }),
  body('preferences').optional().isArray({ max: 10 }),
  body('constraints').optional().isLength({ max: 500 }).escape(),
];

function validate(req: Request, res: Response): boolean {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return false;
  }
  return true;
}

router.post('/generate-itinerary', destinationRules, async (req: Request, res: Response) => {
  if (!validate(req, res)) return;

  const { destination, origin, dates, travellers, budget, preferences, constraints } = req.body;
  logger.info('Generating itinerary', { destination, origin });

  openSSE(res);
  try {
    await generateItinerary(
      {
        destination, origin,
        dates: dates || 'Flexible',
        travellers: travellers || '2 Adults',
        budget: budget || 'Mid-range ($150-300/day)',
        preferences: Array.isArray(preferences) ? preferences : [],
        constraints: constraints || '',
      },
      (chunk) => sendChunk(res, chunk),
      () => sendDone(res),
    );
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Generation failed';
    logger.error('Itinerary generation error', { error: msg });
    sendError(res, msg);
  }
});

router.post(
  '/refine-itinerary',
  [
    body('itinerary').notEmpty().withMessage('Itinerary is required'),
    body('instruction').trim().notEmpty().withMessage('Instruction is required').isLength({ max: 300 }).escape(),
  ],
  async (req: Request, res: Response) => {
    if (!validate(req, res)) return;

    logger.info('Refining itinerary');
    openSSE(res);
    try {
      await refineItinerary(
        req.body.itinerary,
        req.body.instruction,
        (chunk) => sendChunk(res, chunk),
        () => sendDone(res),
      );
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Refinement failed';
      logger.error('Itinerary refinement error', { error: msg });
      sendError(res, msg);
    }
  },
);

router.post(
  '/add-day-trip',
  [body('itinerary').notEmpty().withMessage('Itinerary is required')],
  async (req: Request, res: Response) => {
    if (!validate(req, res)) return;

    logger.info('Adding day trip');
    openSSE(res);
    try {
      await addDayTrip(
        req.body.itinerary,
        (chunk) => sendChunk(res, chunk),
        () => sendDone(res),
      );
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Day trip generation failed';
      logger.error('Add day trip error', { error: msg });
      sendError(res, msg);
    }
  },
);

export default router;
