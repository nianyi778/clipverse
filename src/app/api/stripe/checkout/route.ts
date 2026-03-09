import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { stripe, PRICE_IDS } from "@/lib/stripe";
import { getUserById, updateStripeCustomer } from "@/db/queries";

type PlanKey = "pro" | "lifetime" | "team";

const PLAN_TO_PRICE: Record<PlanKey, string> = {
  pro: PRICE_IDS.pro_monthly,
  lifetime: PRICE_IDS.lifetime,
  team: PRICE_IDS.team_monthly,
};

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Please sign in to upgrade" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { plan } = body as { plan: string };

    if (!plan || !(plan in PLAN_TO_PRICE)) {
      return NextResponse.json(
        { success: false, error: "Invalid plan selected" },
        { status: 400 }
      );
    }

    const priceId = PLAN_TO_PRICE[plan as PlanKey];
    if (!priceId || priceId === "placeholder") {
      return NextResponse.json(
        { success: false, error: "Payment is not configured yet" },
        { status: 503 }
      );
    }

    const user = await getUserById(session.user.id);
    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    let customerId = user.stripeCustomerId;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name || undefined,
        metadata: { userId: user.id },
      });
      customerId = customer.id;
      await updateStripeCustomer(user.id, customerId);
    }

    const isOneTime = plan === "lifetime";

    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: isOneTime ? "payment" : "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${request.nextUrl.origin}/pricing?success=true`,
      cancel_url: `${request.nextUrl.origin}/pricing?canceled=true`,
      metadata: { userId: user.id, plan },
    });

    return NextResponse.json({
      success: true,
      url: checkoutSession.url,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Checkout failed";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
