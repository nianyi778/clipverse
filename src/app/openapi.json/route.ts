import { NextRequest, NextResponse } from "next/server";
import { getDeveloperModeConfig } from "@/lib/developer-mode";

export async function GET(request: NextRequest) {
  const origin = request.nextUrl.origin;
  const config = getDeveloperModeConfig();

  const spec = {
    openapi: "3.1.0",
    info: {
      title: "ClipVerse Developer API",
      version: "0.1.0",
      description:
        "REST API for video parsing, download preparation, subtitles, batch processing, and MCP discovery.",
    },
    servers: [{ url: origin }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "API Key",
          description: "Use Authorization: Bearer CLIPVERSE_API_KEY",
        },
      },
      schemas: {
        ParseRequest: {
          type: "object",
          required: ["url"],
          properties: {
            url: { type: "string", format: "uri" },
          },
        },
        DownloadRequest: {
          type: "object",
          required: ["url", "formatId", "type"],
          properties: {
            url: { type: "string", format: "uri" },
            formatId: { type: "string" },
            type: { type: "string", enum: ["video", "audio", "subtitle"] },
            audioFormatId: { type: "string" },
          },
        },
        BatchRequest: {
          type: "object",
          required: ["urls"],
          properties: {
            urls: {
              type: "array",
              minItems: 1,
              maxItems: 10,
              items: { type: "string", format: "uri" },
            },
          },
        },
      },
    },
    paths: {
      "/api/parse": {
        post: {
          summary: "Parse a video URL",
          security: [{ bearerAuth: [] }],
        },
      },
      "/api/download": {
        post: {
          summary: "Create a download URL",
          security: [{ bearerAuth: [] }],
        },
      },
      "/api/subtitles": {
        post: {
          summary: "Get subtitle tracks",
          security: [{ bearerAuth: [] }],
        },
      },
      "/api/batch": {
        post: {
          summary: "Batch parse URLs",
          security: [{ bearerAuth: [] }],
        },
      },
      "/api/mcp": {
        get: { summary: "MCP endpoint metadata" },
        post: {
          summary: "MCP JSON-RPC endpoint",
          security: [{ bearerAuth: [] }],
        },
      },
      "/.well-known/mcp": {
        get: { summary: "MCP discovery document" },
      },
    },
    "x-clipverseDeveloperMode": {
      enabled: config.enabled,
      restAllowedPlans: config.restAllowedPlans,
      mcpAllowedPlans: config.mcpAllowedPlans,
    },
  };

  return NextResponse.json(spec);
}
