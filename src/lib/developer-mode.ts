import { getUserById } from "@/db/queries";
import type { RequestAuthResult } from "@/lib/request-auth";

function parseFlag(value: string | undefined, fallback: boolean): boolean {
  if (value == null) return fallback;
  const normalized = value.trim().toLowerCase();
  return ["1", "true", "yes", "on"].includes(normalized);
}

function parsePlans(value: string | undefined, fallback: string[]): string[] {
  if (!value?.trim()) return fallback;
  return value
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);
}

export function getDeveloperModeConfig() {
  return {
    enabled: parseFlag(process.env.ENABLE_DEVELOPER_MODE, true),
    restAllowedPlans: parsePlans(process.env.DEVELOPER_REST_ALLOWED_PLANS, ["lifetime", "team"]),
    mcpAllowedPlans: parsePlans(process.env.DEVELOPER_MCP_ALLOWED_PLANS, ["lifetime", "team"]),
  };
}

export async function getAuthorizedUserPlan(authResult: RequestAuthResult): Promise<string | null> {
  if (!authResult.userId) return null;
  const user = await getUserById(authResult.userId);
  return user?.plan ?? null;
}

export function isPlanAllowed(plan: string | null, allowedPlans: string[]): boolean {
  if (!plan) return false;
  return allowedPlans.includes(plan.toLowerCase());
}
