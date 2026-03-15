import { NextRequest, NextResponse } from "next/server";
import { getAuthorizedUserPlan, getDeveloperModeConfig, isPlanAllowed } from "@/lib/developer-mode";
import { getSubtitles } from "@/lib/ytdlp-client";
import { authenticateRequest } from "@/lib/request-auth";

interface SubtitlesResponse {
  success: boolean;
  subtitles?: unknown[];
  autoSubtitles?: unknown[];
  error?: string;
}

export async function POST(request: NextRequest): Promise<NextResponse<SubtitlesResponse>> {
  try {
    const authResult = await authenticateRequest(request);
    if (authResult.hadApiKey && !authResult.apiKeyValid) {
      return NextResponse.json(
        { success: false, error: "Invalid API key" },
        { status: 401 }
      );
    }

    if (authResult.authType === "api_key") {
      const config = getDeveloperModeConfig();
      if (!config.enabled) {
        return NextResponse.json(
          { success: false, error: "Developer mode is disabled" },
          { status: 403 }
        );
      }

      const plan = await getAuthorizedUserPlan(authResult);
      if (!isPlanAllowed(plan, config.restAllowedPlans)) {
        return NextResponse.json(
          { success: false, error: "Current plan does not allow developer API access" },
          { status: 403 }
        );
      }
    }

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
