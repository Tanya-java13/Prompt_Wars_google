import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import * as schema from './schema';

const connectionString = process.env.DATABASE_URL!;
const client = postgres(connectionString);

export const db = drizzle(client, { schema });

export async function runMigrations() {
  await client`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      google_id TEXT NOT NULL UNIQUE,
      email TEXT NOT NULL,
      name TEXT NOT NULL,
      avatar_url TEXT,
      generations_used INTEGER NOT NULL DEFAULT 0,
      customizations_used INTEGER NOT NULL DEFAULT 0,
      subscription_status TEXT NOT NULL DEFAULT 'free',
      subscription_expires_at TIMESTAMPTZ,
      razorpay_subscription_id TEXT,
      razorpay_customer_id TEXT,
      created_at TIMESTAMPTZ NOT NULL,
      updated_at TIMESTAMPTZ NOT NULL
    )
  `;
  await client`
    CREATE TABLE IF NOT EXISTS trips (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      destination TEXT NOT NULL,
      origin TEXT NOT NULL,
      dates TEXT NOT NULL,
      travellers TEXT NOT NULL,
      budget TEXT NOT NULL,
      preferences TEXT NOT NULL,
      constraints TEXT,
      itinerary TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL
    )
  `;
}
