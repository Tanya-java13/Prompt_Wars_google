import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  googleId: text('google_id').notNull().unique(),
  email: text('email').notNull(),
  name: text('name').notNull(),
  avatarUrl: text('avatar_url'),
  generationsUsed: integer('generations_used').notNull().default(0),
  customizationsUsed: integer('customizations_used').notNull().default(0),
  subscriptionStatus: text('subscription_status').notNull().default('free'),
  subscriptionExpiresAt: integer('subscription_expires_at', { mode: 'timestamp' }),
  razorpaySubscriptionId: text('razorpay_subscription_id'),
  razorpayCustomerId: text('razorpay_customer_id'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
});

export const trips = sqliteTable('trips', {
  id: text('id').primaryKey(),
  userId: text('user_id'),
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
