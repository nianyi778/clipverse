import { NextRequest, NextResponse } from "next/server";
import { getAuthorizedUserPlan, getDeveloperModeConfig, isPlanAllowed } from "@/lib/developer-mode";
import { parseVideo } from "@/lib/ytdlp-client";
import type { ParseResponse } from "@/types/video";
import { authenticateRequest } from "@/lib/request-auth";

function extractUrl(input: string): string {
  const trimmed = input.trim();
  try { new URL(trimmed); return trimmed; } catch {}
  const match = trimmed.match(/https?:\/\/[^\s\u3000-\u9fff\uff00-\uffef\u{1F000}-\u{1FFFF}]+/u);
  if (match) {
    return match[0].replace(/[^\w\-._~:/?#[\]@!$&'()*+,;=%]+$/, "");
  }
  return trimmed;
}

export async function POST(request: NextRequest): Promise<NextResponse<ParseResponse>> {
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
