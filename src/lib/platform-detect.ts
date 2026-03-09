import type { Platform } from "@/types/video";

interface PlatformPattern {
  platform: Platform;
  patterns: RegExp[];
}

const PLATFORM_PATTERNS: PlatformPattern[] = [
  {
    platform: "youtube",
    patterns: [
      /(?:youtube\.com|youtu\.be)/i,
      /youtube\.com\/shorts\//i,
    ],
  },
  {
    platform: "tiktok",
    patterns: [/tiktok\.com/i, /vm\.tiktok\.com/i],
  },
  {
    platform: "instagram",
    patterns: [/instagram\.com/i, /instagr\.am/i],
  },
  {
    platform: "twitter",
    patterns: [/(?:twitter\.com|x\.com)/i, /t\.co\//i],
  },
  {
    platform: "bilibili",
    patterns: [/bilibili\.com/i, /b23\.tv/i],
  },
  {
    platform: "xiaohongshu",
    patterns: [/xiaohongshu\.com/i, /xhslink\.com/i],
  },
  {
    platform: "douyin",
    patterns: [/douyin\.com/i, /iesdouyin\.com/i],
  },
  {
    platform: "facebook",
    patterns: [/facebook\.com/i, /fb\.watch/i],
  },
  {
    platform: "threads",
    patterns: [/threads\.net/i],
  },
  {
    platform: "pinterest",
    patterns: [/pinterest\.com/i, /pin\.it/i],
  },
  {
    platform: "vimeo",
    patterns: [/vimeo\.com/i],
  },
];

export function detectPlatform(url: string): Platform {
  for (const { platform, patterns } of PLATFORM_PATTERNS) {
    if (patterns.some((re) => re.test(url))) {
      return platform;
    }
  }
  return "other";
}

export function isValidUrl(input: string): boolean {
  try {
    const url = new URL(input);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

const PLATFORM_DISPLAY: Record<Platform, { name: string; color: string }> = {
  youtube: { name: "YouTube", color: "#FF0000" },
  tiktok: { name: "TikTok", color: "#00F2EA" },
  instagram: { name: "Instagram", color: "#E4405F" },
  twitter: { name: "Twitter / X", color: "#1DA1F2" },
  bilibili: { name: "Bilibili", color: "#00A1D6" },
  xiaohongshu: { name: "Xiaohongshu", color: "#FE2C55" },
  douyin: { name: "Douyin", color: "#161823" },
  facebook: { name: "Facebook", color: "#1877F2" },
  threads: { name: "Threads", color: "#FFFFFF" },
  pinterest: { name: "Pinterest", color: "#E60023" },
  vimeo: { name: "Vimeo", color: "#1AB7EA" },
  other: { name: "Other", color: "#888888" },
};

export function getPlatformDisplay(platform: Platform) {
  return PLATFORM_DISPLAY[platform];
}
