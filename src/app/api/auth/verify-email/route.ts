import { NextRequest, NextResponse } from "next/server";
import { verifyEmailToken } from "@/db/queries";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  if (!token) {
    return NextResponse.redirect(new URL("/verify-email?error=missing", req.url));
  }

  const ok = await verifyEmailToken(token);
  if (!ok) {
    return NextResponse.redirect(new URL("/verify-email?error=invalid", req.url));
  }

  return NextResponse.redirect(new URL("/verify-email?success=1", req.url));
}
