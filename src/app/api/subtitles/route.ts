import { NextRequest, NextResponse } from "next/server";
import { getSubtitles } from "@/lib/ytdlp-client";

interface SubtitlesResponse {
  success: boolean;
  subtitles?: unknown[];
  autoSubtitles?: unknown[];
  error?: string;
}

export async function POST(request: NextRequest): Promise<NextResponse<SubtitlesResponse>> {
  try {
    const body = await request.json();
    const { url } = body as { url: string };

    if (!url) {
      return NextResponse.json(
        { success: false, error: "Please provide a valid URL" },
        { status: 400 }
      );
    }

    const result = await getSubtitles(url);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error || "Subtitle extraction failed" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      subtitles: result.subtitles || [],
      autoSubtitles: result.autoSubtitles || [],
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Subtitle extraction failed";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
