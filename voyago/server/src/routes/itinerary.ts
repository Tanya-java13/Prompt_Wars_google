import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { generateItinerary, refineItinerary, addDayTrip } from '../services/claudeService';

const router = Router();

const itineraryValidation = [
  body('destination').trim().notEmpty().isLength({ max: 100 }).escape(),
  body('origin').trim().notEmpty().isLength({ max: 100 }).escape(),
  body('travellers').trim().optional().isLength({ max: 50 }),
  body('budget').trim().optional().isLength({ max: 50 }),
  body('preferences').optional().isArray({ max: 10 }),
  body('constraints').optional().isLength({ max: 500 }).escape(),
];

function sseStream(res: Response) {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');
  res.flushHeaders();
}

router.post('/generate-itinerary', itineraryValidation, async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const { destination, origin, dates, travellers, budget, preferences, constraints } = req.body;

  sseStream(res);

  try {
    await generateItinerary(
      {
        destination,
        origin,
        dates: dates || 'Flexible',
        travellers: travellers || '2 Adults',
        budget: budget || 'Mid-range',
        preferences: Array.isArray(preferences) ? preferences : [],
        constraints: constraints || '',
      },
      (chunk) => res.write(`data: ${JSON.stringify({ chunk })}\n\n`),
      () => {
        res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
        res.end();
      }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Generation failed';
    res.write(`data: ${JSON.stringify({ error: message })}\n\n`);
    res.end();
  }
});

router.post(
  '/refine-itinerary',
  [
    body('itinerary').notEmpty(),
    body('instruction').trim().notEmpty().isLength({ max: 300 }).escape(),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    sseStream(res);

    try {
      await refineItinerary(
        req.body.itinerary,
        req.body.instruction,
        (chunk) => res.write(`data: ${JSON.stringify({ chunk })}\n\n`),
        () => {
          res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
          res.end();
        }
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Refinement failed';
      res.write(`data: ${JSON.stringify({ error: message })}\n\n`);
      res.end();
    }
  }
);

router.post('/add-day-trip', [body('itinerary').notEmpty()], async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  sseStream(res);

  try {
    await addDayTrip(
      req.body.itinerary,
      (chunk) => res.write(`data: ${JSON.stringify({ chunk })}\n\n`),
      () => {
        res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
        res.end();
      }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Day trip generation failed';
    res.write(`data: ${JSON.stringify({ error: message })}\n\n`);
    res.end();
  }
});

export default router;
