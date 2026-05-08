import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from './schema';

const dbPath = process.env.DATABASE_URL || './voyago.db';
const sqlite = new Database(dbPath);

sqlite.exec(`
  CREATE TABLE IF NOT EXISTS trips (
    id TEXT PRIMARY KEY,
    destination TEXT NOT NULL,
    origin TEXT NOT NULL,
    dates TEXT NOT NULL,
    travellers TEXT NOT NULL,
    budget TEXT NOT NULL,
    preferences TEXT NOT NULL,
    constraints TEXT,
    itinerary TEXT NOT NULL,
    created_at INTEGER NOT NULL
  )
`);

export const db = drizzle(sqlite, { schema });
