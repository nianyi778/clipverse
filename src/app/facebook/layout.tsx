import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Facebook Video Downloader — Download Facebook Videos Free",
  description:
    "Download Facebook videos in HD quality for free. Save public Facebook videos, Reels, and stories instantly. No software required.",
  keywords: ["facebook video downloader", "download facebook video", "facebook reels download", "save facebook video", "fb downloader"],
  openGraph: {
    title: "Facebook Video Downloader — HD Quality | ClipVerse",
    description:
      "Save Facebook videos and Reels in high definition quality for free. Works instantly in your browser.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
