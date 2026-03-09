import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bilibili Video Downloader — Download Bilibili Videos Free",
  description:
    "Download Bilibili videos in 1080p and 4K quality for free. Save B站 videos without account or software. Fast and easy.",
  keywords: ["bilibili downloader", "bilibili video download", "b站下载", "bilibili 4k", "download bilibili"],
  openGraph: {
    title: "Bilibili Video Downloader — 1080p & 4K | ClipVerse",
    description:
      "Download any Bilibili (B站) video in high quality for free. No account needed, works instantly in your browser.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
