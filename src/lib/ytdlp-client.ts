const YTDLP_SERVICE_URL = process.env.YTDLP_SERVICE_URL || "http://localhost:8787";
const YTDLP_API_KEY = process.env.YTDLP_API_KEY || "";

async function callService<T>(path: string, body: unknown): Promise<T> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (YTDLP_API_KEY) headers["x-api-key"] = YTDLP_API_KEY;

  const res = await fetch(`${YTDLP_SERVICE_URL}${path}`, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: `Service error ${res.status}` }));
    throw new Error((err as { error?: string }).error || `Service returned ${res.status}`);
  }

  return res.json() as Promise<T>;
}

export async function parseVideo(url: string) {
  return callService<{ success: boolean; data?: unknown; error?: string }>("/parse", { url });
}

export async function getDownload(params: {
  url: string;
  formatId: string;
  type: string;
  audioFormatId?: string;
}) {
  return callService<{
    success: boolean;
    downloadUrl?: string;
    filename?: string;
    requiresMuxing?: boolean;
    error?: string;
  }>("/download", params);
}

export async function getSubtitles(url: string) {
  return callService<{ success: boolean; subtitles?: unknown[]; autoSubtitles?: unknown[]; error?: string }>("/subtitles", { url });
}

export async function batchParse(urls: string[]) {
  return callService<{ success: boolean; items?: unknown[]; error?: string }>("/batch", { urls });
}
