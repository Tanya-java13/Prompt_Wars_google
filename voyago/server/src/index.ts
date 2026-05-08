import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import itineraryRouter from './routes/itinerary';
import tripsRouter from './routes/trips';
import alertsRouter from './routes/alerts';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }));
app.use(express.json());

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

app.listen(PORT, () => console.log(`Voyago server → http://localhost:${PORT}`));
