import { NextRequest, NextResponse } from "next/server";
import { stripe, planFromPriceId } from "@/lib/stripe";
import {
  updateUserPlan,
  createSubscription,
  updateSubscriptionStatus,
} from "@/db/queries";
import type Stripe from "stripe";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const sig = request.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET || ""
    );
  } catch {
    return NextResponse.json(
      { error: "Invalid webhook signature" },
      { status: 400 }
    );
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.userId;
      const plan = session.metadata?.plan;

      if (!userId || !plan) break;

      if (session.mode === "payment") {
        await updateUserPlan(userId, plan as "pro" | "lifetime" | "team");
      }

      if (session.mode === "subscription" && session.subscription) {
        const sub = await stripe.subscriptions.retrieve(
          session.subscription as string
        );
        const firstItem = sub.items.data[0];
        const priceId = firstItem?.price.id;
        const resolvedPlan = planFromPriceId(priceId || "");

        if (resolvedPlan && firstItem) {
          await updateUserPlan(userId, resolvedPlan);
          await createSubscription({
            userId,
            stripeSubscriptionId: sub.id,
            stripePriceId: priceId || "",
            status: "active",
            currentPeriodStart: new Date(
              firstItem.current_period_start * 1000
            ).toISOString(),
            currentPeriodEnd: new Date(
              firstItem.current_period_end * 1000
            ).toISOString(),
          });
        }
      }
      break;
    }

    case "customer.subscription.updated": {
      const sub = event.data.object as Stripe.Subscription;
      const status = sub.status as
        | "active"
        | "canceled"
        | "past_due"
        | "incomplete"
        | "trialing"
        | "unpaid";

      await updateSubscriptionStatus(
        sub.id,
        status,
        sub.cancel_at_period_end
      );

      if (status === "active") {
        const priceId = sub.items.data[0]?.price.id;
        const plan = planFromPriceId(priceId || "");
        const userId = sub.metadata?.userId;
        if (plan && userId) {
          await updateUserPlan(userId, plan);
        }
      }
      break;
    }

    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription;
      await updateSubscriptionStatus(sub.id, "canceled");

      const userId = sub.metadata?.userId;
      if (userId) {
        await updateUserPlan(userId, "free");
      }
      break;
    }

    case "invoice.payment_failed": {
      const invoice = event.data.object as Stripe.Invoice;
      const subId =
        typeof invoice.parent?.subscription_details?.subscription === "string"
          ? invoice.parent.subscription_details.subscription
          : null;
      if (subId) {
        await updateSubscriptionStatus(subId, "past_due");
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}
