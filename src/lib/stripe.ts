import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY === "placeholder") {
  console.warn("STRIPE_SECRET_KEY not configured — payment features disabled");
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2026-02-25.clover",
  typescript: true,
});

export const PRICE_IDS = {
  pro_monthly: process.env.STRIPE_PRO_PRICE_ID || "",
  lifetime: process.env.STRIPE_LIFETIME_PRICE_ID || "",
  team_monthly: process.env.STRIPE_TEAM_PRICE_ID || "",
} as const;

export function planFromPriceId(priceId: string): "pro" | "lifetime" | "team" | null {
  if (priceId === PRICE_IDS.pro_monthly) return "pro";
  if (priceId === PRICE_IDS.lifetime) return "lifetime";
  if (priceId === PRICE_IDS.team_monthly) return "team";
  return null;
}
