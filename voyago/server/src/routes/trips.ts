import { Router, Request, Response } from 'express';
import { db } from '../db';
import { trips } from '../db/schema';
import { eq } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

router.post('/trips/save', async (req: Request, res: Response) => {
  try {
    const { destination, origin, dates, travellers, budget, preferences, constraints, itinerary } = req.body;
    const id = uuidv4();

    await db.insert(trips).values({
      id,
      destination,
      origin,
      dates,
      travellers,
      budget,
      preferences: JSON.stringify(preferences || []),
      constraints: constraints || '',
      itinerary: JSON.stringify(itinerary),
      createdAt: new Date(),
    });

    res.json({ id, message: 'Trip saved successfully' });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Save failed';
    res.status(500).json({ error: message });
  }
});

router.get('/trips/:id', async (req: Request, res: Response) => {
  try {
    const result = await db.select().from(trips).where(eq(trips.id, req.params.id)).limit(1);
    if (!result.length) {
      res.status(404).json({ error: 'Trip not found' });
      return;
    }
    const t = result[0];
    res.json({ ...t, preferences: JSON.parse(t.preferences), itinerary: JSON.parse(t.itinerary) });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Fetch failed';
    res.status(500).json({ error: message });
  }
});

export default router;
