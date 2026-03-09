import { NextResponse } from "next/server";
import crypto from "crypto";
import { auth } from "@/lib/auth";
import { getUserById, setEmailVerifyToken } from "@/db/queries";
import { sendVerificationEmail } from "@/lib/resend";

export async function POST() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Not authenticated" }, { status: 401 });
    }

    const user = await getUserById(session.user.id);
    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }
    if (user.emailVerified) {
      return NextResponse.json({ success: false, error: "Email already verified" }, { status: 400 });
    }

    const token = crypto.randomBytes(32).toString("hex");
    await setEmailVerifyToken(user.id, token);
    await sendVerificationEmail(user.email, token);

    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
