import { NextRequest, NextResponse } from "next/server";
import { detectPlatform } from "@/lib/platform-detect";
import { getAuthorizedUserPlan, getDeveloperModeConfig, isPlanAllowed } from "@/lib/developer-mode";
import { getDownload } from "@/lib/ytdlp-client";
import {
  checkDownloadQuota,
  incrementDownloadCount,
  recordDownload,
  updateDownloadStatus,
} from "@/db/queries";
import type { DownloadResponse } from "@/types/video";
import { authenticateRequest } from "@/lib/request-auth";

export async function POST(request: NextRequest): Promise<NextResponse<DownloadResponse>> {
  try {
    const body = await request.json();
    const { url, formatId, type, audioFormatId, quality } = body as {
      url: string;
      formatId: string;
      type: "video" | "audio" | "subtitle";
      audioFormatId?: string;
      quality?: string;
    };

    if (!url || !formatId) {
      return NextResponse.json(
        { success: false, error: "Missing required parameters" },
        { status: 400 }
      );
    }

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

    const userId = authResult.userId;

    if (userId) {
      const quota = await checkDownloadQuota(userId);
      if (!quota.allowed) {
        return NextResponse.json(
          {
            success: false,
            error: `Daily download limit reached (${quota.limit}). Upgrade your plan for more downloads.`,
          },
          { status: 429 }
        );
      }
    }

    const platform = detectPlatform(url);
    const downloadId = userId
      ? await recordDownload({
          userId,
          url,
          platform,
          formatId,
          quality,
          status: "processing",
        })
      : null;

    let result: {
      success: boolean;
      downloadUrl?: string;
      filename?: string;
      requiresMuxing?: boolean;
      error?: string;
    };

    try {
      result = await getDownload({ url, formatId, type, audioFormatId });
    } catch (extractError) {
      if (downloadId) {
        await updateDownloadStatus(
          downloadId,
          "failed",
          extractError instanceof Error ? extractError.message : "Extraction failed"
        );
      }
      throw extractError;
    }

    if (!result.success || !result.downloadUrl) {
      if (downloadId) {
        await updateDownloadStatus(downloadId, "failed", result.error || "No stream URL returned");
      }
      return NextResponse.json(
        { success: false, error: result.error || "Could not retrieve download URL" },
        { status: 500 }
      );
    }

    if (downloadId) {
      await updateDownloadStatus(downloadId, "completed");
    }
    if (userId) {
      await incrementDownloadCount(userId);
    }

    return NextResponse.json({
      success: true,
      downloadUrl: result.downloadUrl,
      filename: result.filename,
      requiresMuxing: result.requiresMuxing || false,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Download failed";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
