import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "YouTube Video Downloader — Download YouTube Videos Free",
  description:
    "Download YouTube videos in 4K, 1080p, 720p, MP3. No software, no sign-up required. Fastest YouTube downloader online.",
  keywords: ["youtube downloader", "download youtube video", "youtube to mp4", "youtube 4k download", "youtube mp3"],
  openGraph: {
    title: "YouTube Video Downloader — 4K, 1080p, MP3 | ClipVerse",
    description:
      "Download any YouTube video for free. Choose quality up to 4K, extract audio as MP3. Works in your browser instantly.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
