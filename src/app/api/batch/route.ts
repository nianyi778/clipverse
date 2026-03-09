import { NextRequest, NextResponse } from "next/server";
import { batchParse } from "@/lib/ytdlp-client";
import type { BatchResponse } from "@/types/batch";

const MAX_BATCH_SIZE = 10;

export async function POST(request: NextRequest): Promise<NextResponse<BatchResponse>> {
  try {
    const body = await request.json();
    const { urls } = body as { urls: string[] };

    if (!urls || !Array.isArray(urls) || urls.length === 0) {
      return NextResponse.json(
        { success: false, error: "Please provide at least one URL" },
        { status: 400 }
      );
    }

    if (urls.length > MAX_BATCH_SIZE) {
      return NextResponse.json(
        { success: false, error: `Maximum ${MAX_BATCH_SIZE} URLs per batch` },
        { status: 400 }
      );
    }

    const result = await batchParse(urls);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error || "Batch processing failed" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, items: result.items } as BatchResponse);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Batch processing failed";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
