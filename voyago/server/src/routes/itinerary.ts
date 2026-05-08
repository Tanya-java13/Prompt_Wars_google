import { Router, Request, Response } from 'express';
import { generateItinerary } from '../services/claudeService';

const router = Router();

router.post('/generate-itinerary', async (req: Request, res: Response) => {
  const { destination, origin, dates, travellers, budget, preferences, constraints } = req.body;

  if (!destination || !origin) {
    res.status(400).json({ error: 'Destination and origin are required' });
    return;
  }

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');
  res.flushHeaders();

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
      (chunk) => {
        res.write(`data: ${JSON.stringify({ chunk })}\n\n`);
      },
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

export default router;
