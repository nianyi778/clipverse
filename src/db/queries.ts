import { eq, and, desc, sql, count } from "drizzle-orm";
import { db, users, downloads, subscriptions, apiKeys } from "./index";
import type { NewUser, NewDownload } from "./schema";
import crypto from "crypto";

const PLAN_LIMITS: Record<string, number> = {
  free: 5,
  pro: 100,
  lifetime: 500,
  team: 1000,
};

function generateId(): string {
  return crypto.randomUUID();
}

export async function createUser(data: Omit<NewUser, "id">): Promise<string> {
  const id = generateId();
  await db.insert(users).values({ ...data, id });
  return id;
}

export async function getUserByEmail(email: string) {
  const result = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);
  return result[0] ?? null;
}

export async function getUserByGoogleId(googleId: string) {
  const result = await db
    .select()
    .from(users)
    .where(eq(users.googleId, googleId))
    .limit(1);
  return result[0] ?? null;
}

export async function getUserById(id: string) {
  const result = await db
    .select()
    .from(users)
    .where(eq(users.id, id))
    .limit(1);
  return result[0] ?? null;
}

export async function upsertGoogleUser(profile: {
  googleId: string;
  email: string;
  name: string;
  avatarUrl?: string;
}): Promise<string> {
  const existing = await getUserByGoogleId(profile.googleId);
  if (existing) {
    await db
      .update(users)
      .set({
        name: profile.name,
        avatarUrl: profile.avatarUrl,
      })
      .where(eq(users.id, existing.id));
    return existing.id;
  }
  return createUser(profile);
}

export async function checkDownloadQuota(userId: string): Promise<{
  allowed: boolean;
  used: number;
  limit: number;
}> {
  const user = await getUserById(userId);
  if (!user) return { allowed: false, used: 0, limit: 0 };

  const today = new Date().toISOString().slice(0, 10);
  const limit = PLAN_LIMITS[user.plan] ?? PLAN_LIMITS.free;

  if (user.dailyDownloadsReset !== today) {
    await db
      .update(users)
      .set({ dailyDownloads: 0, dailyDownloadsReset: today })
      .where(eq(users.id, userId));
    return { allowed: true, used: 0, limit };
  }

  return {
    allowed: user.dailyDownloads < limit,
    used: user.dailyDownloads,
    limit,
  };
}

export async function incrementDownloadCount(userId: string): Promise<void> {
  await db
    .update(users)
    .set({
      dailyDownloads: sql`${users.dailyDownloads} + 1`,
    })
    .where(eq(users.id, userId));
}

export async function recordDownload(
  data: Omit<NewDownload, "id">
): Promise<string> {
  const id = generateId();
  await db.insert(downloads).values({ ...data, id });
  return id;
}

export async function updateDownloadStatus(
  id: string,
  status: "completed" | "failed",
  error?: string
): Promise<void> {
  await db
    .update(downloads)
    .set({ status, error })
    .where(eq(downloads.id, id));
}

export async function getUserDownloads(userId: string, limit = 50) {
  return db
    .select()
    .from(downloads)
    .where(eq(downloads.userId, userId))
    .orderBy(desc(downloads.createdAt))
    .limit(limit);
}

export async function getUserDownloadCount(userId: string): Promise<number> {
  const result = await db
    .select({ total: count() })
    .from(downloads)
    .where(eq(downloads.userId, userId));
  return result[0]?.total ?? 0;
}

export async function updateUserPlan(
  userId: string,
  plan: "free" | "pro" | "lifetime" | "team"
): Promise<void> {
  await db
    .update(users)
    .set({ plan })
    .where(eq(users.id, userId));
}

export async function updateStripeCustomer(
  userId: string,
  stripeCustomerId: string
): Promise<void> {
  await db
    .update(users)
    .set({ stripeCustomerId })
    .where(eq(users.id, userId));
}

export async function createSubscription(data: {
  userId: string;
  stripeSubscriptionId: string;
  stripePriceId: string;
  status: "active" | "canceled" | "past_due" | "incomplete" | "trialing" | "unpaid";
  currentPeriodStart?: string;
  currentPeriodEnd?: string;
}): Promise<string> {
  const id = generateId();
  await db.insert(subscriptions).values({ ...data, id });
  return id;
}

export async function updateSubscriptionStatus(
  stripeSubscriptionId: string,
  status: "active" | "canceled" | "past_due" | "incomplete" | "trialing" | "unpaid",
  cancelAtPeriodEnd?: boolean
): Promise<void> {
  const updates: Record<string, unknown> = { status };
  if (cancelAtPeriodEnd !== undefined) {
    updates.cancelAtPeriodEnd = cancelAtPeriodEnd;
  }
  await db
    .update(subscriptions)
    .set(updates)
    .where(eq(subscriptions.stripeSubscriptionId, stripeSubscriptionId));
}

export async function getActiveSubscription(userId: string) {
  const result = await db
    .select()
    .from(subscriptions)
    .where(
      and(
        eq(subscriptions.userId, userId),
        eq(subscriptions.status, "active")
      )
    )
    .limit(1);
  return result[0] ?? null;
}

export async function createApiKey(
  userId: string,
  name: string
): Promise<{ id: string; key: string }> {
  const id = generateId();
  const key = `cv_${crypto.randomBytes(32).toString("hex")}`;
  await db.insert(apiKeys).values({ id, userId, name, key });
  return { id, key };
}

export async function getUserApiKeys(userId: string) {
  const rows = await db
    .select()
    .from(apiKeys)
    .where(eq(apiKeys.userId, userId))
    .orderBy(desc(apiKeys.createdAt));
  return rows.map((k) => ({
    id: k.id,
    name: k.name,
    keyPreview: `cv_...${k.key.slice(-8)}`,
    lastUsedAt: k.lastUsedAt,
    requestCount: k.requestCount,
    createdAt: k.createdAt,
  }));
}

export async function deleteApiKey(id: string, userId: string): Promise<boolean> {
  const result = await db
    .delete(apiKeys)
    .where(and(eq(apiKeys.id, id), eq(apiKeys.userId, userId)));
  return (result as unknown as { affectedRows: number }).affectedRows > 0;
}

export async function validateApiKey(key: string) {
  const result = await db
    .select()
    .from(apiKeys)
    .where(eq(apiKeys.key, key))
    .limit(1);

  if (!result[0]) return null;

  await db
    .update(apiKeys)
    .set({
      lastUsedAt: new Date(),
      requestCount: sql`${apiKeys.requestCount} + 1`,
    })
    .where(eq(apiKeys.id, result[0].id));

  return result[0];
}
