import type { ParsedVideo } from "@/types/video";
import { parseVideo, getDownload, getSubtitles, batchParse } from "@/lib/ytdlp-client";

export interface McpToolDefinition {
  name: string;
  title: string;
  description: string;
  inputSchema: Record<string, unknown>;
}

export interface McpResourceDefinition {
  uri: string;
  name: string;
  title: string;
  description: string;
  mimeType: string;
}

export interface McpPromptDefinition {
  name: string;
  title: string;
  description: string;
  arguments?: Array<{
    name: string;
    description: string;
    required?: boolean;
  }>;
}

export const MCP_SERVER_INFO = {
  name: "clipverse",
  version: "0.1.0",
  title: "ClipVerse MCP",
};

export const MCP_TOOLS: McpToolDefinition[] = [
  {
    name: "clipverse_parse_video",
    title: "Parse Video",
    description: "Parse a supported video URL and return metadata, formats, author, duration, and subtitles.",
    inputSchema: {
      type: "object",
      properties: {
        url: { type: "string", description: "Public video URL to inspect." },
      },
      required: ["url"],
      additionalProperties: false,
    },
  },
  {
    name: "clipverse_get_download",
    title: "Get Download URL",
    description: "Create a direct download URL for a previously inspected media format.",
    inputSchema: {
      type: "object",
      properties: {
        url: { type: "string", description: "Original video URL." },
        formatId: { type: "string", description: "Format ID returned by parse_video." },
        type: {
          type: "string",
          enum: ["video", "audio", "subtitle"],
          description: "Requested media type.",
        },
        audioFormatId: { type: "string", description: "Optional audio format ID for muxed downloads." },
      },
      required: ["url", "formatId", "type"],
      additionalProperties: false,
    },
  },
  {
    name: "clipverse_get_subtitles",
    title: "Get Subtitles",
    description: "List subtitle and auto subtitle tracks for a supported video URL.",
    inputSchema: {
      type: "object",
      properties: {
        url: { type: "string", description: "Public video URL." },
      },
      required: ["url"],
      additionalProperties: false,
    },
  },
  {
    name: "clipverse_batch_parse",
    title: "Batch Parse URLs",
    description: "Parse up to 10 video URLs in one request.",
    inputSchema: {
      type: "object",
      properties: {
        urls: {
          type: "array",
          items: { type: "string" },
          minItems: 1,
          maxItems: 10,
          description: "List of public video URLs.",
        },
      },
      required: ["urls"],
      additionalProperties: false,
    },
  },
];

export const MCP_RESOURCES: McpResourceDefinition[] = [
  {
    uri: "clipverse://docs/developer-overview",
    name: "developer-overview",
    title: "Developer Overview",
    description: "High-level developer integration notes covering REST, OpenAPI, discovery, and MCP.",
    mimeType: "text/markdown",
  },
  {
    uri: "clipverse://docs/openapi",
    name: "openapi",
    title: "OpenAPI Spec",
    description: "Location of the REST OpenAPI description for ClipVerse.",
    mimeType: "application/json",
  },
  {
    uri: "clipverse://docs/mcp-discovery",
    name: "mcp-discovery",
    title: "MCP Discovery",
    description: "Location and auth model for the ClipVerse MCP endpoint.",
    mimeType: "application/json",
  },
];

export const MCP_PROMPTS: McpPromptDefinition[] = [
  {
    name: "clipverse_integration_plan",
    title: "Integration Plan",
    description: "Create a third-party integration plan for ClipVerse using REST or MCP.",
    arguments: [
      { name: "environment", description: "Target environment such as Node.js, Python, or workflow automation.", required: false },
      { name: "goal", description: "What the integration should accomplish.", required: false },
    ],
  },
  {
    name: "clipverse_download_operator",
    title: "Download Operator",
    description: "Guide an agent through parse, format selection, and download preparation for a video URL.",
    arguments: [
      { name: "url", description: "Video URL to inspect and prepare.", required: true },
    ],
  },
];

function jsonContent(data: unknown) {
  return [
    {
      type: "text" as const,
      text: JSON.stringify(data, null, 2),
    },
  ];
}

function validateString(value: unknown, field: string): string {
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`${field} is required`);
  }
  return value.trim();
}

function validateUrlList(value: unknown): string[] {
  if (!Array.isArray(value) || value.length === 0) {
    throw new Error("urls must contain at least one URL");
  }
  if (value.length > 10) {
    throw new Error("Maximum 10 URLs per batch");
  }
  const urls = value.map((item) => validateString(item, "url"));
  return urls;
}

function summarizeParsedVideo(video: ParsedVideo) {
  return {
    id: video.id,
    platform: video.platform,
    title: video.title,
    duration: video.duration,
    author: video.author,
    mediaType: video.mediaType,
    videoFormats: video.videoFormats.map((item) => ({
      formatId: item.formatId,
      quality: item.quality,
      container: item.container,
      hasAudio: item.hasAudio,
      fileSize: item.fileSize,
    })),
    audioFormats: video.audioFormats.map((item) => ({
      formatId: item.formatId,
      quality: item.quality,
      container: item.container,
      fileSize: item.fileSize,
    })),
    subtitles: video.subtitles ?? [],
  };
}

export function getMcpResourceContents(uri: string, origin: string) {
  switch (uri) {
    case "clipverse://docs/developer-overview":
      return {
        uri,
        mimeType: "text/markdown",
        text: [
          "# ClipVerse Developer Overview",
          "",
          `- REST docs: ${origin}/api-docs`,
          `- OpenAPI spec: ${origin}/openapi.json`,
          `- MCP discovery: ${origin}/.well-known/mcp`,
          `- MCP endpoint: ${origin}/api/mcp`,
          "- Authentication: Authorization: Bearer CLIPVERSE_API_KEY",
          "- Common workflow: parse URL -> inspect formats -> request download -> stream if muxing is required",
        ].join("\n"),
      };

    case "clipverse://docs/openapi":
      return {
        uri,
        mimeType: "application/json",
        text: JSON.stringify(
          {
            openapiUrl: `${origin}/openapi.json`,
            docsUrl: `${origin}/api-docs`,
          },
          null,
          2
        ),
      };

    case "clipverse://docs/mcp-discovery":
      return {
        uri,
        mimeType: "application/json",
        text: JSON.stringify(
          {
            discoveryUrl: `${origin}/.well-known/mcp`,
            endpoint: `${origin}/api/mcp`,
            auth: "Authorization: Bearer CLIPVERSE_API_KEY",
            supports: ["initialize", "tools/list", "tools/call", "resources/list", "resources/read", "prompts/list", "prompts/get"],
          },
          null,
          2
        ),
      };

    default:
      throw new Error(`Unknown resource: ${uri}`);
  }
}

export function getMcpPromptMessages(
  name: string,
  args: Record<string, unknown> | undefined,
  origin: string
) {
  switch (name) {
    case "clipverse_integration_plan": {
      const environment =
        typeof args?.environment === "string" && args.environment.trim()
          ? args.environment.trim()
          : "a third-party client";
      const goal =
        typeof args?.goal === "string" && args.goal.trim()
          ? args.goal.trim()
          : "integrate video parsing and download preparation";

      return {
        description: "Plan a ClipVerse integration.",
        messages: [
          {
            role: "user" as const,
            content: {
              type: "text",
              text: [
                `Create an integration plan for ${environment}.`,
                `Goal: ${goal}.`,
                `Use ClipVerse docs at ${origin}/api-docs, OpenAPI at ${origin}/openapi.json, and MCP at ${origin}/api/mcp.`,
                "Include auth strategy, endpoint sequence, error handling, and fallback when requiresMuxing is true.",
              ].join("\n"),
            },
          },
        ],
      };
    }

    case "clipverse_download_operator": {
      const url = validateString(args?.url, "url");
      return {
        description: "Walk an agent through download preparation.",
        messages: [
          {
            role: "user" as const,
            content: {
              type: "text",
              text: [
                `Inspect and prepare download steps for: ${url}`,
                "1. Parse the URL.",
                "2. Pick the best sensible format.",
                "3. If audio and video are split, choose a matching audio format.",
                "4. Return a concise recommendation with the exact ClipVerse tool calls or REST requests.",
              ].join("\n"),
            },
          },
        ],
      };
    }

    default:
      throw new Error(`Unknown prompt: ${name}`);
  }
}

export async function executeMcpTool(name: string, args: Record<string, unknown> | undefined) {
  switch (name) {
    case "clipverse_parse_video": {
      const url = validateString(args?.url, "url");
      const result = await parseVideo(url);
      if (!result.success || !result.data) {
        throw new Error(result.error || "Failed to parse video");
      }
      return {
        content: jsonContent(summarizeParsedVideo(result.data as ParsedVideo)),
        structuredContent: summarizeParsedVideo(result.data as ParsedVideo),
      };
    }

    case "clipverse_get_download": {
      const url = validateString(args?.url, "url");
      const formatId = validateString(args?.formatId, "formatId");
      const type = validateString(args?.type, "type");
      const audioFormatId =
        typeof args?.audioFormatId === "string" && args.audioFormatId.trim()
          ? args.audioFormatId.trim()
          : undefined;
      const result = await getDownload({ url, formatId, type, audioFormatId });
      if (!result.success || !result.downloadUrl) {
        throw new Error(result.error || "Failed to generate download URL");
      }
      const payload = {
        downloadUrl: result.downloadUrl,
        filename: result.filename ?? null,
      };
      return {
        content: jsonContent(payload),
        structuredContent: payload,
      };
    }

    case "clipverse_get_subtitles": {
      const url = validateString(args?.url, "url");
      const result = await getSubtitles(url);
      if (!result.success) {
        throw new Error(result.error || "Failed to get subtitles");
      }
      const payload = {
        subtitles: result.subtitles ?? [],
        autoSubtitles: result.autoSubtitles ?? [],
      };
      return {
        content: jsonContent(payload),
        structuredContent: payload,
      };
    }

    case "clipverse_batch_parse": {
      const urls = validateUrlList(args?.urls);
      const result = await batchParse(urls);
      if (!result.success) {
        throw new Error(result.error || "Failed to batch parse URLs");
      }
      const payload = {
        items: result.items ?? [],
      };
      return {
        content: jsonContent(payload),
        structuredContent: payload,
      };
    }

    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}
