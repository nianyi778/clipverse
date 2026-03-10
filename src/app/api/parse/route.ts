import { NextRequest, NextResponse } from "next/server";
import { parseVideo } from "@/lib/ytdlp-client";
import type { ParseResponse } from "@/types/video";

function extractUrl(input: string): string {
  const trimmed = input.trim();
  try { new URL(trimmed); return trimmed; } catch {}
  const match = trimmed.match(/https?:\/\/[^\s\u3000-\u9fff\uff00-\uffef]+/);
  if (match) {
    return match[0].replace(/[^\w\-._~:/?#[\]@!$&'()*+,;=%]+$/, "");
  }
  return trimmed;
}

export async function POST(request: NextRequest): Promise<NextResponse<ParseResponse>> {
  try {
    const body = await request.json();
    const { url: rawUrl } = body as { url: string };

    if (!rawUrl) {
      return NextResponse.json(
        { success: false, error: "Please provide a valid URL" },
        { status: 400 }
      );
    }

    const url = extractUrl(rawUrl);

    const result = await parseVideo(url);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error || "Failed to parse video" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data: result.data } as ParseResponse);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to parse video";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
