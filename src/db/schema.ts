import {
  mysqlTable,
  varchar,
  text,
  int,
  boolean,
  timestamp,
  mysqlEnum,
} from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: varchar("id", { length: 36 }).primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }),
  passwordHash: text("password_hash"),
  avatarUrl: text("avatar_url"),
  googleId: varchar("google_id", { length: 255 }).unique(),
  plan: mysqlEnum("plan", ["free", "pro", "lifetime", "team"])
    .notNull()
    .default("free"),
  stripeCustomerId: varchar("stripe_customer_id", { length: 255 }).unique(),
  stripeSubscriptionId: varchar("stripe_subscription_id", { length: 255 }),
  dailyDownloads: int("daily_downloads").notNull().default(0),
  dailyDownloadsReset: varchar("daily_downloads_reset", { length: 10 }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow().onUpdateNow(),
});

export const downloads = mysqlTable("downloads", {
  id: varchar("id", { length: 36 }).primaryKey(),
  userId: varchar("user_id", { length: 36 }).references(() => users.id),
  url: text("url").notNull(),
  platform: varchar("platform", { length: 50 }).notNull(),
  title: text("title"),
  formatId: varchar("format_id", { length: 50 }),
  quality: varchar("quality", { length: 20 }),
  fileSize: varchar("file_size", { length: 50 }),
  status: mysqlEnum("status", ["pending", "processing", "completed", "failed"])
    .notNull()
    .default("pending"),
  error: text("error"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const subscriptions = mysqlTable("subscriptions", {
  id: varchar("id", { length: 36 }).primaryKey(),
  userId: varchar("user_id", { length: 36 })
    .notNull()
    .references(() => users.id),
  stripeSubscriptionId: varchar("stripe_subscription_id", {
    length: 255,
  })
    .notNull()
    .unique(),
  stripePriceId: varchar("stripe_price_id", { length: 255 }).notNull(),
  status: mysqlEnum("status", [
    "active",
    "canceled",
    "past_due",
    "incomplete",
    "trialing",
    "unpaid",
  ]).notNull(),
  currentPeriodStart: varchar("current_period_start", { length: 30 }),
  currentPeriodEnd: varchar("current_period_end", { length: 30 }),
  cancelAtPeriodEnd: boolean("cancel_at_period_end").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const apiKeys = mysqlTable("api_keys", {
  id: varchar("id", { length: 36 }).primaryKey(),
  userId: varchar("user_id", { length: 36 })
    .notNull()
    .references(() => users.id),
  key: varchar("key", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  lastUsedAt: timestamp("last_used_at"),
  requestCount: int("request_count").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Download = typeof downloads.$inferSelect;
export type NewDownload = typeof downloads.$inferInsert;
export type Subscription = typeof subscriptions.$inferSelect;
export type ApiKey = typeof apiKeys.$inferSelect;
