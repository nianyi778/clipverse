import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getUserByResetToken, resetUserPassword } from "@/db/queries";

export async function POST(req: NextRequest) {
  try {
    const { token, password } = await req.json();
    if (!token || !password) {
      return NextResponse.json({ success: false, error: "Token and password required" }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json({ success: false, error: "Password must be at least 8 characters" }, { status: 400 });
    }

    const user = await getUserByResetToken(token);
    if (!user || !user.passwordResetExpires) {
      return NextResponse.json({ success: false, error: "Invalid or expired reset link" }, { status: 400 });
    }
    if (new Date(user.passwordResetExpires) < new Date()) {
      return NextResponse.json({ success: false, error: "Reset link has expired. Please request a new one." }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    await resetUserPassword(user.id, passwordHash);

    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
