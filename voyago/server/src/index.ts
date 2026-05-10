import express, { type Request, type Response, type NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import path from 'path';
import itineraryRouter from './routes/itinerary';
import tripsRouter from './routes/trips';
import alertsRouter from './routes/alerts';
import authRouter from './routes/auth';
import subscriptionRouter from './routes/subscription';
import statsRouter from './routes/stats';
import { attachUser } from './middleware/auth';
import { logger } from './utils/logger';

dotenv.config({ path: path.resolve(process.cwd(), '../.env') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const app = express();
const PORT = process.env.PORT || 3001;
const isProd = process.env.NODE_ENV === 'production';

// ─── Security ─────────────────────────────────────────────────────────────────

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc:    ["'self'"],
      scriptSrc:     ["'self'", 'https://accounts.google.com', 'https://checkout.razorpay.com'],
      styleSrc:      ["'self'", "'unsafe-inline'", 'https://accounts.google.com'],
      imgSrc:        ["'self'", 'data:', 'https:'],
      connectSrc:    ["'self'", 'https://accounts.google.com', 'https://api.razorpay.com', 'https://lumberjack-cx.razorpay.com'],
      fontSrc:       ["'self'", 'https://fonts.gstatic.com'],
      frameSrc:      ["'self'", 'https://accounts.google.com', 'https://api.razorpay.com'],
      objectSrc:     ["'none'"],
      frameAncestors:["'none'"],
    },
  },
  crossOriginEmbedderPolicy: false,
  crossOriginOpenerPolicy: { policy: 'same-origin-allow-popups' },
}));

app.use(cors({
  origin: isProd ? (process.env.CLIENT_URL ?? true) : 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// ─── Parsing ──────────────────────────────────────────────────────────────────

app.use(cookieParser());
app.use(express.json({ limit: '1mb' }));

// ─── Auth ─────────────────────────────────────────────────────────────────────

app.use(attachUser);

// ─── Rate limiting ────────────────────────────────────────────────────────────

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' },
});

const generateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Generation limit reached, please wait a minute.' },
});

app.use('/api', apiLimiter);
app.use('/api/generate-itinerary', generateLimiter);
app.use('/api/refine-itinerary', generateLimiter);
app.use('/api/add-day-trip', generateLimiter);

// ─── Request logging ──────────────────────────────────────────────────────────

app.use((req: Request, _res: Response, next: NextFunction) => {
  logger.info(`${req.method} ${req.path}`, { ip: req.ip });
  next();
});

// ─── Routes ───────────────────────────────────────────────────────────────────

app.use('/api', authRouter);
app.use('/api', subscriptionRouter);
app.use('/api', statsRouter);
app.use('/api', itineraryRouter);
app.use('/api', tripsRouter);
app.use('/api', alertsRouter);

app.get('/api/destinations', (_req, res) => {
  res.json([
    { id: 1, name: 'Kyoto',        country: 'Japan',     emoji: '⛩️',  price: 'From $2,400', meta: '7 days · Cultural'  },
    { id: 2, name: 'Amalfi Coast', country: 'Italy',     emoji: '🌊',  price: 'From $3,200', meta: '10 days · Coastal'  },
    { id: 3, name: 'Patagonia',    country: 'Argentina', emoji: '🏔️', price: 'From $2,800', meta: '14 days · Adventure' },
    { id: 4, name: 'Marrakech',    country: 'Morocco',   emoji: '🕌',  price: 'From $1,600', meta: '5 days · Culture'   },
    { id: 5, name: 'Bali',         country: 'Indonesia', emoji: '🌴',  price: 'From $1,800', meta: '8 days · Wellness'  },
  ]);
});

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version ?? '1.0.0',
    aiEnabled: Boolean(process.env.GOOGLE_AI_API_KEY),
  });
});

// ─── Global error handler ────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  logger.error('Unhandled error', { message: err.message });
  res.status(500).json({ error: 'Internal server error' });
});

// ─── Static files (production) ────────────────────────────────────────────────

if (isProd) {
  const clientDist = path.resolve(__dirname, '../../client/dist');
  app.use(express.static(clientDist, { maxAge: '1h' }));
  app.get('*', (_req, res) => res.sendFile(path.join(clientDist, 'index.html')));
}

app.listen(PORT, () => {
  logger.info('Voyago server started', { port: PORT, env: process.env.NODE_ENV ?? 'development' });
});
