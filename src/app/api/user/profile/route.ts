import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getUserById, getUserDownloadCount, checkDownloadQuota, getActiveSubscription } from "@/db/queries";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Not authenticated" },
        { status: 401 }
      );
    }

    const user = await getUserById(session.user.id);
    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    const totalDownloads = await getUserDownloadCount(user.id);
    const quota = await checkDownloadQuota(user.id);
    const subscription = await getActiveSubscription(user.id);

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatarUrl: user.avatarUrl,
        plan: user.plan,
        totalDownloads,
        dailyQuota: {
          used: quota.used,
          limit: quota.limit,
          remaining: quota.limit - quota.used,
        },
        subscription: subscription
          ? {
              status: subscription.status,
              currentPeriodEnd: subscription.currentPeriodEnd,
              cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
            }
          : null,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load profile";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
