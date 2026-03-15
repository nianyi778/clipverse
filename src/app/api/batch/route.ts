import { NextRequest, NextResponse } from "next/server";
import { getAuthorizedUserPlan, getDeveloperModeConfig, isPlanAllowed } from "@/lib/developer-mode";
import { batchParse } from "@/lib/ytdlp-client";
import type { BatchResponse } from "@/types/batch";
import { authenticateRequest } from "@/lib/request-auth";

const MAX_BATCH_SIZE = 10;

export async function POST(request: NextRequest): Promise<NextResponse<BatchResponse>> {
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
