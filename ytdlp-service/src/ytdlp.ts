import { execFile, spawn, type ChildProcess } from "child_process";
import { promisify } from "util";
import { existsSync } from "fs";

const execFileAsync = promisify(execFile);

const YTDLP_BIN = process.env.YTDLP_PATH || "yt-dlp";
const EXTRACT_TIMEOUT_MS = Number(process.env.YTDLP_TIMEOUT) || 30_000;
const MAX_BUFFER = 50 * 1024 * 1024;
const COOKIES_DIR = process.env.COOKIES_DIR || "/cookies";

const PROXY_URL = process.env.PROXY_URL || "";
const TIKTOK_PROXY = process.env.TIKTOK_PROXY || PROXY_URL;
const BILIBILI_PROXY = process.env.BILIBILI_PROXY || PROXY_URL;
const DOUYIN_PROXY = process.env.DOUYIN_PROXY || PROXY_URL;
const XIAOHONGSHU_PROXY = process.env.XIAOHONGSHU_PROXY || PROXY_URL;

const BGUTIL_POT_URL = process.env.BGUTIL_POT_URL || "";
const YOUTUBE_COOKIES = process.env.YOUTUBE_COOKIES_FILE || `${COOKIES_DIR}/youtube.txt`;
const TIKTOK_COOKIES = process.env.TIKTOK_COOKIES_FILE || `${COOKIES_DIR}/tiktok.txt`;
const BILIBILI_COOKIES = process.env.BILIBILI_COOKIES_FILE || `${COOKIES_DIR}/bilibili.txt`;
const INSTAGRAM_COOKIES = process.env.INSTAGRAM_COOKIES_FILE || `${COOKIES_DIR}/instagram.txt`;
const TWITTER_COOKIES = process.env.TWITTER_COOKIES_FILE || `${COOKIES_DIR}/twitter.txt`;
const FACEBOOK_COOKIES = process.env.FACEBOOK_COOKIES_FILE || `${COOKIES_DIR}/facebook.txt`;
const DOUYIN_COOKIES = process.env.DOUYIN_COOKIES_FILE || `${COOKIES_DIR}/douyin.txt`;
const XIAOHONGSHU_COOKIES = process.env.XIAOHONGSHU_COOKIES_FILE || `${COOKIES_DIR}/xiaohongshu.txt`;
const COOKIES_FILE = process.env.COOKIES_FILE || "";

const BASE_ARGS = ["--js-runtimes", "deno", "--no-check-certificates"];

function cookiesArg(path: string): string[] {
  return path && existsSync(path) ? ["--cookies", path] : [];
}

function getHostname(url: string): string {
  try { return new URL(url).hostname; } catch { return ""; }
}

function getPlatformArgs(url: string): string[] {
  const extra: string[] = [];
  const hostname = getHostname(url);

  const isYouTube = hostname.includes("youtube.com") || hostname.includes("youtu.be");
  const isTikTok = hostname.includes("tiktok.com");
  const isBilibili = hostname.includes("bilibili.com") || hostname.includes("b23.tv");
  const isDouyin = hostname.includes("douyin.com") || hostname.includes("iesdouyin.com");
  const isXiaohongshu = hostname.includes("xiaohongshu.com") || hostname.includes("xhslink.com");
  const isInstagram = hostname.includes("instagram.com");
  const isTwitter = hostname.includes("twitter.com") || hostname.includes("x.com");
  const isFacebook = hostname.includes("facebook.com") || hostname.includes("fb.watch");

  if (isYouTube) {
    if (BGUTIL_POT_URL) {
      extra.push("--extractor-args", "youtube:player_client=mweb");
      extra.push("--extractor-args", `youtubepot-bgutilhttp:base_url=${BGUTIL_POT_URL}`);
    }
    extra.push(...cookiesArg(YOUTUBE_COOKIES));
  }

  if (isTikTok) {
    if (TIKTOK_PROXY) extra.push("--proxy", TIKTOK_PROXY);
    extra.push(...cookiesArg(TIKTOK_COOKIES));
    extra.push("--xff", "US");
  }

  if (isBilibili) {
    if (BILIBILI_PROXY) extra.push("--proxy", BILIBILI_PROXY);
    extra.push(...cookiesArg(BILIBILI_COOKIES));
  }

  if (isDouyin) {
    if (DOUYIN_PROXY) extra.push("--proxy", DOUYIN_PROXY);
    extra.push(...cookiesArg(DOUYIN_COOKIES));
  }

  if (isInstagram) {
    extra.push(...cookiesArg(INSTAGRAM_COOKIES));
    extra.push("--impersonate", "chrome-124");
  }

  if (isTwitter) {
    extra.push(...cookiesArg(TWITTER_COOKIES));
    extra.push("--impersonate", "chrome-124");
  }

  if (isFacebook) {
    extra.push(...cookiesArg(FACEBOOK_COOKIES));
    extra.push("--impersonate", "chrome-99");
    extra.push("--extractor-args", "facebook:formats=dash_sd_src,dash_hd_src,sd_src,hd_src");
  }

  if (isXiaohongshu) {
    if (XIAOHONGSHU_PROXY) extra.push("--proxy", XIAOHONGSHU_PROXY);
    extra.push(...cookiesArg(XIAOHONGSHU_COOKIES));
    extra.push("--impersonate", "chrome-124");
  }

  if (COOKIES_FILE && !extra.includes("--cookies")) {
    extra.push("--cookies", COOKIES_FILE);
  }

  return extra;
}

interface YtdlpFormat {
  format_id: string;
  ext: string;
  resolution?: string;
  width?: number | null;
  height?: number | null;
  fps?: number | null;
  vcodec?: string | null;
  acodec?: string | null;
  filesize?: number | null;
  filesize_approx?: number | null;
  tbr?: number | null;
  vbr?: number | null;
  abr?: number | null;
  url?: string;
  format_note?: string;
  protocol?: string;
}

interface YtdlpSubtitleTrack {
  ext: string;
  url: string;
  name?: string;
}

interface YtdlpResult {
  id: string;
  title: string;
  description?: string;
  thumbnail?: string;
  duration?: number;
  view_count?: number;
  upload_date?: string;
  uploader?: string;
  channel?: string;
  uploader_url?: string;
  webpage_url: string;
  extractor?: string;
  formats?: YtdlpFormat[];
  subtitles?: Record<string, YtdlpSubtitleTrack[]>;
  automatic_captions?: Record<string, YtdlpSubtitleTrack[]>;
  _type?: string;
}

type VideoQuality = "4K" | "2K" | "1080p" | "720p" | "480p" | "360p" | "240p" | "144p";

export function spawnYtdlpStream(url: string, formatId: string, audioFormatId?: string): ChildProcess {
  const formatSpec = audioFormatId ? `${formatId}+${audioFormatId}` : formatId;
  const platformArgs = getPlatformArgs(url);
  const args = [
    ...BASE_ARGS, ...platformArgs,
    "-f", formatSpec,
    "--merge-output-format", "mp4",
    "-o", "-",
    "--no-warnings",
    url,
  ];
  return spawn(YTDLP_BIN, args, {
    env: { ...process.env, PYTHONDONTWRITEBYTECODE: "1" },
    stdio: ["ignore", "pipe", "pipe"],
  });
}

export async function extractVideoInfo(url: string) {
  const raw = await runYtdlp(url, ["-j", "--no-download", "--no-warnings"]);
  const data: YtdlpResult = JSON.parse(raw);
  return mapToParsedVideo(data, url);
}

export async function extractSubtitles(url: string) {
  const raw = await runYtdlp(url, ["-j", "--no-download", "--no-warnings", "--skip-download"]);
  const data: YtdlpResult = JSON.parse(raw);
  return {
    manual: mapSubtitles(data.subtitles || {}),
    auto: mapSubtitles(data.automatic_captions || {}),
  };
}

export async function getDownloadUrl(url: string, formatId: string) {
  const raw = await runYtdlp(url, ["-f", formatId, "--get-url", "--get-filename", "--no-warnings"]);
  const lines = raw.trim().split("\n").filter(Boolean);
  return {
    streamUrl: lines[0] || "",
    filename: lines[1] || `clipverse_${Date.now()}.mp4`,
  };
}

export async function getMergedDownloadUrl(url: string, videoFormatId: string, audioFormatId?: string) {
  const formatSpec = audioFormatId ? `${videoFormatId}+${audioFormatId}` : videoFormatId;

  const jsonRaw = await runYtdlp(url, ["-f", formatSpec, "-j", "--no-download", "--no-warnings"]);
  const data: YtdlpResult = JSON.parse(jsonRaw);

  const urlRaw = await runYtdlp(url, ["-f", formatSpec, "--get-url", "--no-warnings"]);
  const urls = urlRaw.trim().split("\n").filter(Boolean);

  return {
    streamUrl: urls[0] || "",
    filename: sanitizeFilename(data.title || "clipverse_download") + ".mp4",
  };
}

async function runYtdlp(url: string, args: string[]): Promise<string> {
  try {
    const platformArgs = getPlatformArgs(url);
    const { stdout } = await execFileAsync(
      YTDLP_BIN,
      [...BASE_ARGS, ...platformArgs, ...args, url],
      {
        timeout: EXTRACT_TIMEOUT_MS,
        maxBuffer: MAX_BUFFER,
        env: { ...process.env, PYTHONDONTWRITEBYTECODE: "1" },
      }
    );
    return stdout;
  } catch (error: unknown) {
    const err = error as { stderr?: string; code?: number; message?: string };
    const stderr = err.stderr || err.message || "Unknown yt-dlp error";

    if (stderr.includes("Video unavailable") || stderr.includes("Private video")) {
      throw new Error("This video is unavailable or private");
    }
    if (stderr.includes("Sign in to confirm your age")) {
      throw new Error("This video requires age verification and cannot be downloaded");
    }
    if (
      stderr.includes("login required") ||
      stderr.includes("Login required") ||
      stderr.includes("not logged in") ||
      stderr.includes("cookies") ||
      stderr.includes("This content is only available to logged-in users") ||
      stderr.includes("Please log in") ||
      stderr.includes("You need to log in")
    ) {
      throw new Error("This video requires login. Please try a different video.");
    }
    if (stderr.includes("Unsupported URL")) {
      throw new Error("This URL is not supported. Please try a different link.");
    }
    if (stderr.includes("HTTP Error 429")) {
      throw new Error("Rate limited by the platform. Please try again in a few minutes.");
    }
    if (stderr.includes("HTTP Error 403")) {
      throw new Error("Access denied by the platform. The video may be geo-restricted.");
    }
    if (stderr.includes("HTTP Error 404") || stderr.includes("404")) {
      throw new Error("Video not found. It may have been deleted or the URL is incorrect.");
    }
    if (stderr.includes("ENOENT") || stderr.includes("not found")) {
      throw new Error("yt-dlp is not installed on the server.");
    }

    throw new Error(`Extraction failed: ${stderr.slice(0, 200)}`);
  }
}

function detectPlatform(url: string): string {
  const patterns: [string, RegExp[]][] = [
    ["youtube", [/(?:youtube\.com|youtu\.be)/i]],
    ["tiktok", [/tiktok\.com/i]],
    ["instagram", [/instagram\.com/i, /instagr\.am/i]],
    ["twitter", [/(?:twitter\.com|x\.com)/i]],
    ["bilibili", [/bilibili\.com/i, /b23\.tv/i]],
    ["xiaohongshu", [/xiaohongshu\.com/i, /xhslink\.com/i]],
    ["douyin", [/douyin\.com/i, /iesdouyin\.com/i]],
    ["facebook", [/facebook\.com/i, /fb\.watch/i]],
  ];
  for (const [name, regs] of patterns) {
    if (regs.some((r) => r.test(url))) return name;
  }
  return "other";
}

function mapToParsedVideo(data: YtdlpResult, originalUrl: string) {
  const platform = detectPlatform(originalUrl);
  const formats = data.formats || [];

  const videoFormats = formats
    .filter((f) => {
      const hasVideo = f.vcodec && f.vcodec !== "none";
      const isStoryboard = f.format_id?.startsWith("sb");
      return hasVideo && !isStoryboard;
    })
    .map(mapVideoFormat)
    .sort((a, b) => qualityOrder(b.quality) - qualityOrder(a.quality));

  const audioFormats = formats
    .filter((f) => {
      const hasAudio = f.acodec && f.acodec !== "none";
      const hasVideo = f.vcodec && f.vcodec !== "none";
      return hasAudio && !hasVideo;
    })
    .map(mapAudioFormat)
    .sort((a, b) => {
      const aBr = parseInt(a.quality) || 0;
      const bBr = parseInt(b.quality) || 0;
      return bBr - aBr;
    });

  const subtitles = mapSubtitles(data.subtitles || {});

  return {
    id: data.id,
    url: originalUrl,
    platform,
    title: data.title,
    description: data.description,
    thumbnail: data.thumbnail,
    duration: data.duration,
    author: data.channel || data.uploader,
    uploadDate: formatUploadDate(data.upload_date),
    viewCount: data.view_count,
    mediaType: "video",
    videoFormats: deduplicateFormats(videoFormats),
    audioFormats,
    subtitles: subtitles.length > 0 ? subtitles : undefined,
  };
}

function mapVideoFormat(f: YtdlpFormat) {
  const height = f.height || 0;
  const hasAudio = !!(f.acodec && f.acodec !== "none");
  const exact = f.filesize || 0;
  const approx = f.filesize_approx || 0;
  const size = exact || approx;

  return {
    formatId: f.format_id,
    quality: heightToQuality(height),
    codec: normalizeVideoCodec(f.vcodec || ""),
    container: f.ext || "mp4",
    fileSize: size ? `${exact ? "" : "~"}${formatFileSize(size)}` : undefined,
    hasAudio,
    fps: f.fps ?? undefined,
    bitrate: f.tbr ? `${Math.round(f.tbr)}k` : undefined,
  };
}

function mapAudioFormat(f: YtdlpFormat) {
  const exact = f.filesize || 0;
  const approx = f.filesize_approx || 0;
  const size = exact || approx;
  const abr = f.abr || f.tbr || 0;

  return {
    formatId: f.format_id,
    quality: abr ? `${Math.round(abr)}kbps` : "unknown",
    codec: normalizeAudioCodec(f.acodec || ""),
    container: f.ext || "m4a",
    fileSize: size ? `${exact ? "" : "~"}${formatFileSize(size)}` : undefined,
  };
}

function mapSubtitles(subs: Record<string, YtdlpSubtitleTrack[]>) {
  const result: { language: string; languageCode: string; url: string; format: string }[] = [];
  for (const [langCode, tracks] of Object.entries(subs)) {
    const srtTrack = tracks.find((t) => t.ext === "srt");
    const vttTrack = tracks.find((t) => t.ext === "vtt");
    const bestTrack = srtTrack || vttTrack || tracks[0];
    if (bestTrack) {
      result.push({
        language: bestTrack.name || langCode,
        languageCode: langCode,
        url: bestTrack.url,
        format: bestTrack.ext === "srt" || bestTrack.ext === "vtt" ? bestTrack.ext : "srt",
      });
    }
  }
  return result;
}

function heightToQuality(height: number): VideoQuality {
  if (height >= 2160) return "4K";
  if (height >= 1440) return "2K";
  if (height >= 1080) return "1080p";
  if (height >= 720) return "720p";
  if (height >= 480) return "480p";
  if (height >= 360) return "360p";
  if (height >= 240) return "240p";
  return "144p";
}

function qualityOrder(q: VideoQuality): number {
  const order: Record<VideoQuality, number> = { "4K": 8, "2K": 7, "1080p": 6, "720p": 5, "480p": 4, "360p": 3, "240p": 2, "144p": 1 };
  return order[q] || 0;
}

function normalizeVideoCodec(raw: string): string {
  const lower = raw.toLowerCase();
  if (lower.includes("av01") || lower.includes("av1")) return "AV1";
  if (lower.includes("vp9") || lower.includes("vp09")) return "VP9";
  return "H.264";
}

function normalizeAudioCodec(raw: string): string {
  const lower = raw.toLowerCase();
  if (lower.includes("opus")) return "Opus";
  if (lower.includes("mp4a") || lower.includes("aac")) return "AAC";
  if (lower.includes("mp3")) return "MP3";
  return "AAC";
}

function formatFileSize(bytes: number): string {
  if (bytes >= 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  if (bytes >= 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${bytes} B`;
}

function formatUploadDate(raw?: string): string | undefined {
  if (!raw || raw.length !== 8) return raw;
  return `${raw.slice(0, 4)}-${raw.slice(4, 6)}-${raw.slice(6, 8)}`;
}

function sanitizeFilename(name: string): string {
  return name.replace(/[<>:"/\\|?*]/g, "_").replace(/\s+/g, " ").trim().slice(0, 200);
}

function deduplicateFormats<T extends { quality: string; codec: string; container: string }>(formats: T[]): T[] {
  const byQuality = new Map<string, T[]>();
  for (const f of formats) {
    const existing = byQuality.get(f.quality) || [];
    existing.push(f);
    byQuality.set(f.quality, existing);
  }
  const result: T[] = [];
  for (const [, group] of byQuality) {
    const seen = new Set<string>();
    for (const f of group) {
      const key = `${f.codec}-${f.container}`;
      if (!seen.has(key)) { seen.add(key); result.push(f); }
    }
  }
  return result;
}
