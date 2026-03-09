import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getUserDownloads } from "@/db/queries";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Not authenticated" },
        { status: 401 }
      );
    }

    const records = await getUserDownloads(session.user.id);

    return NextResponse.json({
      success: true,
      downloads: records,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load downloads";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
