import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "TikTok Video Downloader — Download TikTok Without Watermark",
  description:
    "Download TikTok videos without watermark for free. Save TikTok videos in HD quality to your device instantly. No app needed.",
  keywords: ["tiktok downloader", "tiktok no watermark", "download tiktok video", "save tiktok", "tiktok hd download"],
  openGraph: {
    title: "TikTok Downloader — No Watermark, HD Quality | ClipVerse",
    description:
      "Remove the TikTok watermark and download videos in full HD quality. Free, fast, and works on any device.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
