import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { createUser, getUserByEmail, setEmailVerifyToken } from "@/db/queries";
import { sendVerificationEmail } from "@/lib/resend";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, name } = body as {
      email: string;
      password: string;
      name?: string;
    };

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Email and password are required" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { success: false, error: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    const existing = await getUserByEmail(email);
    if (existing) {
      return NextResponse.json(
        { success: false, error: "An account with this email already exists" },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const userId = await createUser({
      email,
      name: name || email.split("@")[0],
      passwordHash,
    });

    const verifyToken = crypto.randomBytes(32).toString("hex");
    await setEmailVerifyToken(userId, verifyToken);
    sendVerificationEmail(email, verifyToken).catch((err) => {
      console.error("Failed to send verification email:", err);
    });

    return NextResponse.json({ success: true, userId });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Registration failed";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
