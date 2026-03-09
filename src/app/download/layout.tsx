import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Online Video Downloader",
  description:
    "Download videos from YouTube, TikTok, Instagram, Bilibili, Twitter and 50+ platforms. HD & 4K quality, no watermark, no software needed.",
  openGraph: {
    title: "Free Online Video Downloader | ClipVerse",
    description:
      "Paste any video URL and download in HD or 4K. Supports YouTube, TikTok, Instagram, Bilibili, Twitter and 50+ sites.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
