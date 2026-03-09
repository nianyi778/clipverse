import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Instagram Reels & Video Downloader — Save Instagram Videos",
  description:
    "Download Instagram Reels, Stories, and videos for free. High quality, no watermark. Works on any device without installing anything.",
  keywords: ["instagram downloader", "instagram reels downloader", "download instagram video", "instagram story download", "save instagram"],
  openGraph: {
    title: "Instagram Reels & Video Downloader | ClipVerse",
    description:
      "Save Instagram Reels, Stories, and videos in HD quality. Free, fast, and no account required.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
