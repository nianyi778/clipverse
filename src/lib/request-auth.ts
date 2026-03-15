import { auth } from "@/lib/auth";
import { validateApiKey } from "@/db/queries";

export interface RequestAuthResult {
  userId: string | null;
  authType: "session" | "api_key" | "anonymous";
  apiKeyId?: string;
  hadApiKey: boolean;
  apiKeyValid: boolean;
}

function extractBearerToken(header: string | null): string | null {
  if (!header) return null;
  const [scheme, token] = header.split(" ");
  if (!scheme || !token) return null;
  if (scheme.toLowerCase() !== "bearer") return null;
  return token.trim() || null;
}

export async function authenticateRequest(request: Request): Promise<RequestAuthResult> {
  const session = await auth();
  if (session?.user?.id) {
    return { userId: session.user.id, authType: "session", hadApiKey: false, apiKeyValid: true };
  }

  const bearerToken = extractBearerToken(request.headers.get("authorization"));
  const headerToken = request.headers.get("x-api-key")?.trim() || null;
  const apiKey = bearerToken || headerToken;

  if (!apiKey) {
    return { userId: null, authType: "anonymous", hadApiKey: false, apiKeyValid: false };
  }

  const record = await validateApiKey(apiKey);
  if (!record) {
    return { userId: null, authType: "anonymous", hadApiKey: true, apiKeyValid: false };
  }

  return {
    userId: record.userId,
    authType: "api_key",
    apiKeyId: record.id,
    hadApiKey: true,
    apiKeyValid: true,
  };
}
