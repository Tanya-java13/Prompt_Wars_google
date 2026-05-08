import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import path from 'path';
import itineraryRouter from './routes/itinerary';
import tripsRouter from './routes/trips';
import alertsRouter from './routes/alerts';

dotenv.config({ path: path.resolve(process.cwd(), '../.env') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const app = express();
const PORT = process.env.PORT || 3001;
const isProd = process.env.NODE_ENV === 'production';

// Security headers
app.use(helmet({ contentSecurityPolicy: false }));

// CORS
app.use(cors({
  origin: isProd ? '*' : (process.env.CLIENT_URL || 'http://localhost:5173'),
  credentials: true,
}));

// Rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' },
});

const generateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Generation limit reached, please wait a minute.' },
});

app.use('/api', apiLimiter);
app.use('/api/generate-itinerary', generateLimiter);
app.use('/api/refine-itinerary', generateLimiter);
app.use('/api/add-day-trip', generateLimiter);

app.use(express.json({ limit: '1mb' }));

// Routes
app.use('/api', itineraryRouter);
app.use('/api', tripsRouter);
app.use('/api', alertsRouter);

app.get('/api/destinations', (_req, res) => {
  res.json([
    { id: 1, name: 'Kyoto', country: 'Japan', emoji: '⛩️', price: 'From $2,400', meta: '7 days · Cultural' },
    { id: 2, name: 'Amalfi Coast', country: 'Italy', emoji: '🌊', price: 'From $3,200', meta: '10 days · Coastal' },
    { id: 3, name: 'Patagonia', country: 'Argentina', emoji: '🏔️', price: 'From $2,800', meta: '14 days · Adventure' },
    { id: 4, name: 'Marrakech', country: 'Morocco', emoji: '🕌', price: 'From $1,600', meta: '5 days · Culture' },
    { id: 5, name: 'Bali', country: 'Indonesia', emoji: '🌴', price: 'From $1,800', meta: '8 days · Wellness' },
  ]);
});

app.get('/api/health', (_req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

// Serve React app in production
if (isProd) {
  const clientDist = path.resolve(__dirname, '../../client/dist');
  app.use(express.static(clientDist));
  app.get('*', (_req, res) => res.sendFile(path.join(clientDist, 'index.html')));
}

app.listen(PORT, () => console.log(`Voyago server → http://localhost:${PORT}`));
