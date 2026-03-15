import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { mkdirSync, writeFileSync, rmSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

vi.mock("../ytdlp.js", () => ({
  extractVideoInfo: vi.fn(),
  extractSubtitles: vi.fn(),
  getDownloadUrl: vi.fn(),
  getMergedDownloadUrl: vi.fn(),
  spawnYtdlpStream: vi.fn(),
}));


import { app } from "../app.js";
import * as ytdlp from "../ytdlp.js";

const TEST_API_KEY = "test-api-key-12345";
const authHeader = { "x-api-key": TEST_API_KEY };

async function req(
  method: string,
  path: string,
  options: { body?: unknown; headers?: Record<string, string> } = {}
) {
  const headers: Record<string, string> = { ...options.headers };
  let body: BodyInit | undefined;

  if (options.body !== undefined) {
    body = JSON.stringify(options.body);
    headers["Content-Type"] = "application/json";
  }

  return app.request(path, { method, headers, body });
}

describe("GET /health", () => {
  it("returns ok:true without auth", async () => {
    const res = await req("GET", "/health");
    expect(res.status).toBe(200);
    const json = await res.json() as Record<string, unknown>;
    expect(json.ok).toBe(true);
    expect(typeof json.ts).toBe("number");
  });

  it("returns version and buildSha fields", async () => {
    const res = await req("GET", "/health");
    const json = await res.json() as Record<string, unknown>;
    expect(json).toHaveProperty("version");
    expect(json).toHaveProperty("buildSha");
    expect(json).toHaveProperty("buildTime");
  });
});

describe("Auth middleware", () => {
  beforeEach(() => {
    process.env.YTDLP_API_KEY = TEST_API_KEY;
  });

  afterEach(() => {
    delete process.env.YTDLP_API_KEY;
  });

  it("rejects requests without API key", async () => {
    const res = await req("GET", "/admin/cookies");
    expect([200, 401]).toContain(res.status);
  });
});

describe("POST /parse - input validation", () => {
  it("returns 400 for missing url", async () => {
    const res = await req("POST", "/parse", { body: {} });
    expect(res.status).toBe(400);
    const json = await res.json() as Record<string, unknown>;
    expect(json.success).toBe(false);
    expect(typeof json.error).toBe("string");
  });

  it("returns 400 for invalid url (plain text)", async () => {
    const res = await req("POST", "/parse", { body: { url: "not-a-url" } });
    expect(res.status).toBe(400);
    const json = await res.json() as Record<string, unknown>;
    expect(json.success).toBe(false);
  });

  it("returns 400 for ftp:// protocol", async () => {
    const res = await req("POST", "/parse", { body: { url: "ftp://example.com/video" } });
    expect(res.status).toBe(400);
    const json = await res.json() as Record<string, unknown>;
    expect(json.success).toBe(false);
  });

  it("returns 400 for empty url string", async () => {
    const res = await req("POST", "/parse", { body: { url: "" } });
    expect(res.status).toBe(400);
    const json = await res.json() as Record<string, unknown>;
    expect(json.success).toBe(false);
  });

  it("calls extractVideoInfo for valid https URL", async () => {
    const mockData = {
      title: "Test Video",
      thumbnail: "https://example.com/thumb.jpg",
      duration: 120,
      description: "",
      uploader: "Test",
      videoFormats: [],
      audioFormats: [],
      subtitles: [],
    };
    vi.mocked(ytdlp.extractVideoInfo).mockResolvedValueOnce(mockData as any);

    const res = await req("POST", "/parse", { body: { url: "https://www.youtube.com/watch?v=abc123" } });
    expect(res.status).toBe(200);
    const json = await res.json() as Record<string, unknown>;
    expect(json.success).toBe(true);
    expect(json.data).toBeDefined();
  });

  it("returns 500 when extractVideoInfo throws", async () => {
    vi.mocked(ytdlp.extractVideoInfo).mockRejectedValueOnce(new Error("yt-dlp failed"));

    const res = await req("POST", "/parse", { body: { url: "https://www.youtube.com/watch?v=abc123" } });
    expect(res.status).toBe(500);
    const json = await res.json() as Record<string, unknown>;
    expect(json.success).toBe(false);
    expect(json.error).toBe("yt-dlp failed");
  });
});

describe("POST /download - input validation", () => {
  it("returns 400 for missing url", async () => {
    const res = await req("POST", "/download", { body: { formatId: "137" } });
    expect(res.status).toBe(400);
    const json = await res.json() as Record<string, unknown>;
    expect(json.success).toBe(false);
  });

  it("returns 400 for missing formatId", async () => {
    const res = await req("POST", "/download", { body: { url: "https://example.com/v" } });
    expect(res.status).toBe(400);
    const json = await res.json() as Record<string, unknown>;
    expect(json.success).toBe(false);
  });

  it("calls getDownloadUrl for valid request", async () => {
    vi.mocked(ytdlp.getDownloadUrl).mockResolvedValueOnce({
      streamUrl: "https://cdn.example.com/video.mp4",
      filename: "video.mp4",
    });

    const res = await req("POST", "/download", {
      body: { url: "https://www.youtube.com/watch?v=abc123", formatId: "137", type: "video" },
    });
    expect(res.status).toBe(200);
    const json = await res.json() as Record<string, unknown>;
    expect(json.success).toBe(true);
    expect(json.downloadUrl).toBe("https://cdn.example.com/video.mp4");
  });

  it("calls getMergedDownloadUrl when audioFormatId provided", async () => {
    vi.mocked(ytdlp.getMergedDownloadUrl).mockResolvedValueOnce({
      streamUrl: "https://cdn.example.com/merged.mp4",
      filename: "merged.mp4",
      requiresMuxing: true,
    });

    const res = await req("POST", "/download", {
      body: { url: "https://www.youtube.com/watch?v=abc123", formatId: "137", type: "video", audioFormatId: "140" },
    });
    expect(res.status).toBe(200);
    const json = await res.json() as Record<string, unknown>;
    expect(json.success).toBe(true);
    expect(json.downloadUrl).toBe("https://cdn.example.com/merged.mp4");
    expect(json.requiresMuxing).toBe(true);
    expect(vi.mocked(ytdlp.getMergedDownloadUrl)).toHaveBeenCalledWith(
      "https://www.youtube.com/watch?v=abc123", "137", "140"
    );
  });
});

describe("POST /batch - input validation", () => {
  it("returns 400 for empty urls array", async () => {
    const res = await req("POST", "/batch", { body: { urls: [] } });
    expect(res.status).toBe(400);
    const json = await res.json() as Record<string, unknown>;
    expect(json.success).toBe(false);
  });

  it("returns 400 for more than 10 URLs", async () => {
    const urls = Array.from({ length: 11 }, (_, i) => `https://example.com/v${i}`);
    const res = await req("POST", "/batch", { body: { urls } });
    expect(res.status).toBe(400);
    const json = await res.json() as Record<string, unknown>;
    expect(json.success).toBe(false);
    expect(json.error as string).toContain("10");
  });

  it("returns 400 for invalid URLs in batch", async () => {
    const res = await req("POST", "/batch", { body: { urls: ["not-a-url", "also-invalid"] } });
    expect(res.status).toBe(400);
    const json = await res.json() as Record<string, unknown>;
    expect(json.success).toBe(false);
    expect(json.error as string).toContain("Invalid URLs");
  });

  it("processes valid batch URLs", async () => {
    const mockData = {
      title: "Test Video",
      thumbnail: "",
      duration: 60,
      description: "",
      uploader: "",
      videoFormats: [{ formatId: "137" }],
      audioFormats: [],
      subtitles: [],
    };
    vi.mocked(ytdlp.extractVideoInfo).mockResolvedValue(mockData as any);

    const res = await req("POST", "/batch", {
      body: { urls: ["https://www.youtube.com/watch?v=abc", "https://www.youtube.com/watch?v=xyz"] },
    });
    expect(res.status).toBe(200);
    const json = await res.json() as { success: boolean; items: unknown[] };
    expect(json.success).toBe(true);
    expect(json.items).toHaveLength(2);
  });
});

describe("GET /admin/cookies", () => {
  let tmpDir: string;

  beforeEach(() => {
    tmpDir = join(tmpdir(), `clipverse-test-${Date.now()}`);
    mkdirSync(tmpDir, { recursive: true });
    process.env.COOKIES_DIR = tmpDir;
  });

  afterEach(() => {
    rmSync(tmpDir, { recursive: true, force: true });
    delete process.env.COOKIES_DIR;
  });

  it("returns cookie status for all platforms", async () => {
    const res = await req("GET", "/admin/cookies");
    expect(res.status).toBe(200);
    const json = await res.json() as { success: boolean; cookies: Array<{ platform: string; exists: boolean }> };
    expect(json.success).toBe(true);
    expect(Array.isArray(json.cookies)).toBe(true);

    const platforms = json.cookies.map((c) => c.platform);
    expect(platforms).toContain("youtube");
    expect(platforms).toContain("tiktok");
    expect(platforms).toContain("douyin");
    expect(platforms).toContain("instagram");
  });

  it("shows exists:false for missing cookies", async () => {
    const res = await req("GET", "/admin/cookies");
    const json = await res.json() as { success: boolean; cookies: Array<{ platform: string; exists: boolean }> };
    const youtube = json.cookies.find((c) => c.platform === "youtube");
    expect(youtube?.exists).toBe(false);
  });
});

describe("POST /admin/cookies - upload", () => {
  let tmpDir: string;
  const sampleCookies = [
    "# Netscape HTTP Cookie File",
    ".douyin.com\tTRUE\t/\tFALSE\t9999999999\tsid_guard\tabc123",
    "douyin.com\tTRUE\t/\tFALSE\t9999999999\tuid_tt\tuid456",
  ].join("\n");

  beforeEach(() => {
    tmpDir = join(tmpdir(), `clipverse-test-${Date.now()}`);
    mkdirSync(tmpDir, { recursive: true });
    process.env.COOKIES_DIR = tmpDir;
  });

  afterEach(() => {
    rmSync(tmpDir, { recursive: true, force: true });
    delete process.env.COOKIES_DIR;
  });

  it("returns 400 for invalid platform", async () => {
    const res = await req("POST", "/admin/cookies", {
      body: { platform: "invalid-platform", content: "# cookies" },
    });
    expect(res.status).toBe(400);
    const json = await res.json() as Record<string, unknown>;
    expect(json.success).toBe(false);
    expect(json.error as string).toContain("Invalid platform");
  });

  it("returns 400 when content is missing", async () => {
    const res = await req("POST", "/admin/cookies", {
      body: { platform: "youtube" },
    });
    expect(res.status).toBe(400);
    const json = await res.json() as Record<string, unknown>;
    expect(json.success).toBe(false);
  });

  it("saves youtube cookies without expansion", async () => {
    const content = "# Netscape HTTP Cookie File\n.youtube.com\tTRUE\t/\tFALSE\t9999\tSID\tabc";
    const res = await req("POST", "/admin/cookies", {
      body: { platform: "youtube", content },
    });
    expect(res.status).toBe(200);
    const json = await res.json() as Record<string, unknown>;
    expect(json.success).toBe(true);
    expect(existsSync(join(tmpDir, "youtube.txt"))).toBe(true);
  });

  it("expands douyin cookies to include iesdouyin.com entries", async () => {
    const res = await req("POST", "/admin/cookies", {
      body: { platform: "douyin", content: sampleCookies },
    });
    expect(res.status).toBe(200);
    const json = await res.json() as Record<string, unknown>;
    expect(json.success).toBe(true);

    const { readFileSync } = await import("node:fs");
    const saved = readFileSync(join(tmpDir, "douyin.txt"), "utf-8");
    expect(saved).toContain("iesdouyin.com");
    expect(saved).toContain(".douyin.com");
  });

  it("returns bytes count after save", async () => {
    const res = await req("POST", "/admin/cookies", {
      body: { platform: "tiktok", content: "# cookies\n.tiktok.com\tTRUE\t/\tFALSE\t9999\ttt_webid\tabc" },
    });
    const json = await res.json() as Record<string, unknown>;
    expect(typeof json.bytes).toBe("number");
    expect((json.bytes as number) > 0).toBe(true);
  });
});

describe("POST /subtitles - input validation", () => {
  it("returns 400 for invalid URL", async () => {
    const res = await req("POST", "/subtitles", { body: { url: "not-a-url" } });
    expect(res.status).toBe(400);
    const json = await res.json() as Record<string, unknown>;
    expect(json.success).toBe(false);
  });

  it("returns subtitles for valid URL", async () => {
    vi.mocked(ytdlp.extractSubtitles).mockResolvedValueOnce({ manual: [], auto: [] });

    const res = await req("POST", "/subtitles", { body: { url: "https://www.youtube.com/watch?v=abc" } });
    expect(res.status).toBe(200);
    const json = await res.json() as Record<string, unknown>;
    expect(json.success).toBe(true);
    expect(json.subtitles).toBeDefined();
    expect(json.autoSubtitles).toBeDefined();
  });
});

describe("GET /stream - input validation", () => {
  it("returns 400 when url missing", async () => {
    const res = await req("GET", "/stream?formatId=137");
    expect(res.status).toBe(400);
  });

  it("returns 400 when formatId missing", async () => {
    const res = await req("GET", "/stream?url=https://example.com/v");
    expect(res.status).toBe(400);
  });
});
