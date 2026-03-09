import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getUserById, getUserApiKeys, createApiKey } from "@/db/queries";

const PLAN_ALLOWS_API = new Set(["lifetime", "team"]);
const MAX_KEYS_PER_USER = 10;

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Not authenticated" }, { status: 401 });
    }

    const user = await getUserById(session.user.id);
    if (!user || !PLAN_ALLOWS_API.has(user.plan)) {
      return NextResponse.json({ success: false, error: "API access requires Lifetime or Team plan" }, { status: 403 });
    }

    const keys = await getUserApiKeys(session.user.id);
    return NextResponse.json({ success: true, keys });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to list API keys";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Not authenticated" }, { status: 401 });
    }

    const user = await getUserById(session.user.id);
    if (!user || !PLAN_ALLOWS_API.has(user.plan)) {
      return NextResponse.json({ success: false, error: "API access requires Lifetime or Team plan" }, { status: 403 });
    }

    const body = await req.json().catch(() => ({}));
    const name = (body.name as string | undefined)?.trim() || "My API Key";
    if (name.length > 100) {
      return NextResponse.json({ success: false, error: "Key name too long (max 100 chars)" }, { status: 400 });
    }

    const existing = await getUserApiKeys(session.user.id);
    if (existing.length >= MAX_KEYS_PER_USER) {
      return NextResponse.json({ success: false, error: `Maximum ${MAX_KEYS_PER_USER} API keys allowed` }, { status: 400 });
    }

    const { id, key } = await createApiKey(session.user.id, name);
    return NextResponse.json({ success: true, id, key, name }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create API key";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
