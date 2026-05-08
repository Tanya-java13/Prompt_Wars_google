import { Router, Request, Response } from 'express';
import { getNextAlert } from '../services/alertService';

const router = Router();

router.get('/alerts/stream', (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');
  res.flushHeaders();

  res.write(`data: ${JSON.stringify(getNextAlert())}\n\n`);

  const interval = setInterval(() => {
    res.write(`data: ${JSON.stringify(getNextAlert())}\n\n`);
  }, 8000);

  req.on('close', () => clearInterval(interval));
});

export default router;
