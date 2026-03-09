import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { setPasswordResetToken } from "@/db/queries";
import { sendPasswordResetEmail } from "@/lib/resend";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email || typeof email !== "string") {
      return NextResponse.json({ success: false, error: "Email required" }, { status: 400 });
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 60 * 60 * 1000);

    const found = await setPasswordResetToken(email.toLowerCase().trim(), token, expires);

    if (found) {
      await sendPasswordResetEmail(email, token);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
