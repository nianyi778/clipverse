import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { deleteApiKey } from "@/db/queries";

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Not authenticated" }, { status: 401 });
    }

    const { id } = await params;
    const deleted = await deleteApiKey(id, session.user.id);
    if (!deleted) {
      return NextResponse.json({ success: false, error: "Key not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to delete API key";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
