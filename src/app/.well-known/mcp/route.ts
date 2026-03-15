import { NextRequest, NextResponse } from "next/server";
import { MCP_SERVER_INFO, MCP_TOOLS } from "@/lib/mcp";

export async function GET(request: NextRequest) {
  const origin = request.nextUrl.origin;

  return NextResponse.json({
    name: MCP_SERVER_INFO.name,
    title: MCP_SERVER_INFO.title,
    version: MCP_SERVER_INFO.version,
    description: "ClipVerse MCP server for video parsing, download preparation, subtitles, and batch processing.",
    endpoint: `${origin}/api/mcp`,
    transport: "http",
    protocolVersion: "2024-11-05",
    authentication: {
      type: "bearer",
      header: "Authorization",
      format: "Bearer CLIPVERSE_API_KEY",
    },
    capabilities: {
      tools: true,
    },
    tools: MCP_TOOLS.map((tool) => ({
      name: tool.name,
      title: tool.title,
      description: tool.description,
      inputSchema: tool.inputSchema,
    })),
  });
}
