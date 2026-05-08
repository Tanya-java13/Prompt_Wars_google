import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const trips = sqliteTable('trips', {
  id: text('id').primaryKey(),
  destination: text('destination').notNull(),
  origin: text('origin').notNull(),
  dates: text('dates').notNull(),
  travellers: text('travellers').notNull(),
  budget: text('budget').notNull(),
  preferences: text('preferences').notNull(),
  constraints: text('constraints'),
  itinerary: text('itinerary').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});
