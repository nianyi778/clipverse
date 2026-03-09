import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { Readable } from "node:stream";
import { writeFileSync, mkdirSync } from "node:fs";
import { extractVideoInfo, extractSubtitles, getDownloadUrl, getMergedDownloadUrl, spawnYtdlpStream } from "./ytdlp.js";

const COOKIES_DIR = process.env.COOKIES_DIR || "/cookies";

const app = new Hono();
const API_KEY = process.env.YTDLP_API_KEY || "";
const PORT = Number(process.env.PORT) || 8787;

app.use("*", cors());

app.use("*", async (c, next) => {
  if (c.req.path === "/health" || c.req.path === "/proxy" || c.req.path === "/stream") return next();
  if (API_KEY) {
    const key = c.req.header("x-api-key");
    if (key !== API_KEY) return c.json({ success: false, error: "Unauthorized" }, 401);
  }
  return next();
});

app.get("/health", (c) => c.json({ ok: true, ts: Date.now() }));

const VALID_PLATFORMS = ["youtube", "tiktok", "bilibili", "instagram", "twitter", "facebook", "douyin", "xiaohongshu"];

app.post("/admin/cookies", async (c) => {
  if (!API_KEY) return c.json({ success: false, error: "API key not configured" }, 403);
  const key = c.req.header("x-api-key");
  if (key !== API_KEY) return c.json({ success: false, error: "Unauthorized" }, 401);

  try {
    const { platform, content } = await c.req.json<{ platform: string; content: string }>();
    if (!platform || !VALID_PLATFORMS.includes(platform)) {
      return c.json({ success: false, error: `Invalid platform. Use: ${VALID_PLATFORMS.join(", ")}` }, 400);
    }
    if (!content || typeof content !== "string") {
      return c.json({ success: false, error: "content (cookies.txt text) is required" }, 400);
    }
    mkdirSync(COOKIES_DIR, { recursive: true });
    const filePath = `${COOKIES_DIR}/${platform}.txt`;
    writeFileSync(filePath, content, "utf-8");
    return c.json({ success: true, path: filePath, bytes: content.length });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to save cookies";
    return c.json({ success: false, error: message }, 500);
  }
});

app.post("/parse", async (c) => {
  try {
    const { url } = await c.req.json<{ url: string }>();
    if (!url || !isValidUrl(url)) {
      return c.json({ success: false, error: "Please provide a valid URL" }, 400);
    }
    const data = await extractVideoInfo(url);
    return c.json({ success: true, data });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to parse video";
    return c.json({ success: false, error: message }, 500);
  }
});

app.post("/download", async (c) => {
  try {
    const { url, formatId, type, audioFormatId } = await c.req.json<{
      url: string;
      formatId: string;
      type: "video" | "audio" | "subtitle";
      audioFormatId?: string;
    }>();

    if (!url || !formatId || !isValidUrl(url)) {
      return c.json({ success: false, error: "Missing required parameters" }, 400);
    }

    let result: { streamUrl: string; filename: string };

    if (type === "video" && audioFormatId) {
      result = await getMergedDownloadUrl(url, formatId, audioFormatId);
    } else {
      result = await getDownloadUrl(url, formatId);
    }

    if (!result.streamUrl) {
      return c.json({ success: false, error: "Could not retrieve download URL" }, 500);
    }

    return c.json({ success: true, downloadUrl: result.streamUrl, filename: result.filename });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Download failed";
    return c.json({ success: false, error: message }, 500);
  }
});

app.post("/subtitles", async (c) => {
  try {
    const { url } = await c.req.json<{ url: string }>();
    if (!url || !isValidUrl(url)) {
      return c.json({ success: false, error: "Please provide a valid URL" }, 400);
    }
    const { manual, auto } = await extractSubtitles(url);
    return c.json({ success: true, subtitles: manual, autoSubtitles: auto });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Subtitle extraction failed";
    return c.json({ success: false, error: message }, 500);
  }
});

app.post("/batch", async (c) => {
  try {
    const { urls } = await c.req.json<{ urls: string[] }>();
    if (!urls || !Array.isArray(urls) || urls.length === 0) {
      return c.json({ success: false, error: "Please provide at least one URL" }, 400);
    }
    if (urls.length > 10) {
      return c.json({ success: false, error: "Maximum 10 URLs per batch" }, 400);
    }

    const invalid = urls.filter((u) => !isValidUrl(u));
    if (invalid.length > 0) {
      return c.json({ success: false, error: `Invalid URLs: ${invalid.join(", ")}` }, 400);
    }

    const items = await Promise.all(
      urls.map(async (url, index) => {
        const id = `batch-${Date.now()}-${index}`;
        try {
          const parsed = await extractVideoInfo(url);
          return {
            id, url, status: "completed" as const,
            title: parsed.title, thumbnail: parsed.thumbnail,
            duration: parsed.duration, formats: parsed.videoFormats.length,
          };
        } catch (error) {
          return {
            id, url, status: "failed" as const,
            error: error instanceof Error ? error.message : "Extraction failed",
          };
        }
      })
    );

    return c.json({ success: true, items });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Batch processing failed";
    return c.json({ success: false, error: message }, 500);
  }
});

app.get("/stream", async (c) => {
  const url = c.req.query("url");
  const formatId = c.req.query("formatId");
  const audioFormatId = c.req.query("audioFormatId") || undefined;
  const filename = c.req.query("filename") || "download.mp4";

  if (!url || !formatId) return c.json({ error: "Missing url or formatId" }, 400);

  const child = spawnYtdlpStream(url, formatId, audioFormatId);
  if (!child.stdout) return c.json({ error: "Failed to start stream" }, 500);

  const safeFilename = filename.replace(/[^\w\s\-_.()]/g, "_");
  const webStream = Readable.toWeb(child.stdout) as ReadableStream;

  return new Response(webStream, {
    headers: {
      "Content-Type": "application/octet-stream",
      "Content-Disposition": `attachment; filename="${safeFilename}"`,
      "Cache-Control": "no-cache",
    },
  });
});

app.get("/proxy", async (c) => {
  const url = c.req.query("url");
  const filename = c.req.query("filename") || "download.mp4";

  if (!url) return c.json({ error: "Missing url parameter" }, 400);

  const upstream = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" },
  });

  if (!upstream.ok || !upstream.body) {
    return c.json({ error: `Upstream returned ${upstream.status}` }, 502);
  }

  const contentType = upstream.headers.get("content-type") || "application/octet-stream";
  const contentLength = upstream.headers.get("content-length");
  const safeFilename = filename.replace(/[^\w\s\-_.()]/g, "_");

  const headers: Record<string, string> = {
    "Content-Type": contentType,
    "Content-Disposition": `attachment; filename="${safeFilename}"`,
    "Cache-Control": "no-cache",
  };
  if (contentLength) headers["Content-Length"] = contentLength;

  return new Response(upstream.body, { status: 200, headers });
});

function isValidUrl(input: string): boolean {
  try {
    const url = new URL(input);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

serve({ fetch: app.fetch, port: PORT }, () => {
  console.log(`yt-dlp service running on http://localhost:${PORT}`);
});
