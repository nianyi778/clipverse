import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getUserApiKeys, getUserById } from "@/db/queries";
import { getDeveloperModeConfig, isPlanAllowed } from "@/lib/developer-mode";
import { MCP_PROMPTS, MCP_RESOURCES, MCP_TOOLS } from "@/lib/mcp";

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Not authenticated" }, { status: 401 });
    }

    const user = await getUserById(session.user.id);
    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    const config = getDeveloperModeConfig();
    const keys = await getUserApiKeys(user.id);
    const origin = new URL(request.url).origin;

    return NextResponse.json({
      success: true,
      developer: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          plan: user.plan,
        },
        featureAccess: {
          enabled: config.enabled,
          rest: isPlanAllowed(user.plan, config.restAllowedPlans),
          mcp: isPlanAllowed(user.plan, config.mcpAllowedPlans),
        },
        allowedPlans: {
          rest: config.restAllowedPlans,
          mcp: config.mcpAllowedPlans,
        },
        apiKeys: keys,
        endpoints: {
          docs: `${origin}/api-docs`,
          openapi: `${origin}/openapi.json`,
          mcp: `${origin}/api/mcp`,
          discovery: `${origin}/.well-known/mcp`,
        },
        inventory: {
          tools: MCP_TOOLS,
          resources: MCP_RESOURCES,
          prompts: MCP_PROMPTS,
        },
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load developer console";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
