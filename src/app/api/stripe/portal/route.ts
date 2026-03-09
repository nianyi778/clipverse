import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { stripe } from "@/lib/stripe";
import { getUserById } from "@/db/queries";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Not authenticated" },
        { status: 401 }
      );
    }

    const user = await getUserById(session.user.id);
    if (!user?.stripeCustomerId) {
      return NextResponse.json(
        { success: false, error: "No billing account found" },
        { status: 404 }
      );
    }

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: `${request.nextUrl.origin}/pricing`,
    });

    return NextResponse.json({
      success: true,
      url: portalSession.url,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Portal access failed";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
