import { NextRequest, NextResponse } from "next/server";
import { getAuthorizedUserPlan, getDeveloperModeConfig, isPlanAllowed } from "@/lib/developer-mode";
import { authenticateRequest } from "@/lib/request-auth";
import {
  executeMcpTool,
  getMcpPromptMessages,
  getMcpResourceContents,
  MCP_PROMPTS,
  MCP_RESOURCES,
  MCP_SERVER_INFO,
  MCP_TOOLS,
} from "@/lib/mcp";

interface JsonRpcRequest {
  jsonrpc?: string;
  id?: string | number | null;
  method?: string;
  params?: Record<string, unknown>;
}

function success(id: JsonRpcRequest["id"], result: unknown) {
  return NextResponse.json({ jsonrpc: "2.0", id: id ?? null, result });
}

function failure(id: JsonRpcRequest["id"], code: number, message: string, data?: unknown) {
  return NextResponse.json({
    jsonrpc: "2.0",
    id: id ?? null,
    error: { code, message, data },
  });
}

export async function GET(request: NextRequest) {
  const origin = request.nextUrl.origin;
  const config = getDeveloperModeConfig();
  return NextResponse.json({
    name: MCP_SERVER_INFO.name,
    title: MCP_SERVER_INFO.title,
    version: MCP_SERVER_INFO.version,
    endpoint: `${origin}/api/mcp`,
    transport: "streamable-http-compatible",
    authentication: "Authorization: Bearer <CLIPVERSE_API_KEY>",
    developerMode: {
      enabled: config.enabled,
      allowedPlans: config.mcpAllowedPlans,
    },
    resources: MCP_RESOURCES.map((resource) => ({
      uri: resource.uri,
      name: resource.name,
      title: resource.title,
    })),
    prompts: MCP_PROMPTS.map((prompt) => ({
      name: prompt.name,
      title: prompt.title,
    })),
    tools: MCP_TOOLS.map((tool) => ({
      name: tool.name,
      title: tool.title,
      description: tool.description,
    })),
  });
}

export async function POST(request: NextRequest) {
  let body: JsonRpcRequest;

  try {
    body = (await request.json()) as JsonRpcRequest;
  } catch {
    return failure(null, -32700, "Invalid JSON body");
  }

  if (body.jsonrpc !== "2.0" || !body.method) {
    return failure(body.id, -32600, "Invalid JSON-RPC request");
  }

  try {
    switch (body.method) {
      case "initialize":
        return success(body.id, {
          protocolVersion: "2024-11-05",
          serverInfo: MCP_SERVER_INFO,
          capabilities: {
            tools: { listChanged: false },
            resources: { listChanged: false, subscribe: false },
            prompts: { listChanged: false },
          },
        });

      case "tools/list":
        return success(body.id, {
          tools: MCP_TOOLS,
        });

      case "resources/list":
        return success(body.id, {
          resources: MCP_RESOURCES,
        });

      case "resources/read": {
        const uri = typeof body.params?.uri === "string" ? body.params.uri : "";
        const resource = getMcpResourceContents(uri, request.nextUrl.origin);
        return success(body.id, {
          contents: [resource],
        });
      }

      case "prompts/list":
        return success(body.id, {
          prompts: MCP_PROMPTS,
        });

      case "prompts/get": {
        const name = typeof body.params?.name === "string" ? body.params.name : "";
        const args =
          body.params?.arguments && typeof body.params.arguments === "object"
            ? (body.params.arguments as Record<string, unknown>)
            : undefined;
        const prompt = getMcpPromptMessages(name, args, request.nextUrl.origin);
        return success(body.id, {
          description: prompt.description,
          messages: prompt.messages,
        });
      }

      case "tools/call": {
        const config = getDeveloperModeConfig();
        if (!config.enabled) {
          return failure(body.id, -32002, "Developer mode is disabled");
        }

        const authResult = await authenticateRequest(request);
        if (authResult.hadApiKey && !authResult.apiKeyValid) {
          return failure(body.id, -32001, "Invalid API key", {
            hint: "Generate a new key from the ClipVerse dashboard and pass it as Authorization: Bearer <CLIPVERSE_API_KEY>.",
          });
        }
        if (!authResult.userId) {
          return failure(body.id, -32001, "Authentication required", {
            hint: "Pass Authorization: Bearer <CLIPVERSE_API_KEY> to call MCP tools.",
          });
        }

        const plan = await getAuthorizedUserPlan(authResult);
        if (!isPlanAllowed(plan, config.mcpAllowedPlans)) {
          return failure(body.id, -32003, "Current plan does not allow MCP access", {
            allowedPlans: config.mcpAllowedPlans,
          });
        }

        const name = typeof body.params?.name === "string" ? body.params.name : "";
        const args =
          body.params?.arguments && typeof body.params.arguments === "object"
            ? (body.params.arguments as Record<string, unknown>)
            : undefined;
        const result = await executeMcpTool(name, args);
        return success(body.id, result);
      }

      default:
        return failure(body.id, -32601, `Method not found: ${body.method}`);
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "MCP call failed";
    return failure(body.id, -32000, message);
  }
}
