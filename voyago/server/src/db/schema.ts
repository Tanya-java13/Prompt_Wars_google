import { pgTable, text, integer, timestamp } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: text('id').primaryKey(),
  googleId: text('google_id').notNull().unique(),
  email: text('email').notNull(),
  name: text('name').notNull(),
  avatarUrl: text('avatar_url'),
  generationsUsed: integer('generations_used').notNull().default(0),
  customizationsUsed: integer('customizations_used').notNull().default(0),
  subscriptionStatus: text('subscription_status').notNull().default('free'),
  subscriptionExpiresAt: timestamp('subscription_expires_at'),
  razorpaySubscriptionId: text('razorpay_subscription_id'),
  razorpayCustomerId: text('razorpay_customer_id'),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull(),
});

export const trips = pgTable('trips', {
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
  createdAt: timestamp('created_at').notNull(),
});
