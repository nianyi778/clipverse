import type { Metadata } from "next";
import YouTubeContent from "./content";

export const metadata: Metadata = {
  title: "YouTube 4K Video Downloader — Free Online | ClipVerse",
  description:
    "Download YouTube videos in 4K, 8K, 1080p HD quality for free. Save YouTube Shorts, extract audio to MP3, download full playlists. Fast, no software needed.",
  keywords:
    "YouTube downloader, YouTube 4K download, YouTube to MP3, YouTube Shorts download, YouTube playlist downloader, free YouTube video download",
  openGraph: {
    title: "YouTube 4K Video Downloader — Free Online | ClipVerse",
    description:
      "Download YouTube videos in 4K, 8K, and HD. Save Shorts, extract audio, download playlists. Fast and free.",
    type: "website",
    url: "https://clipverse.app/youtube",
    siteName: "ClipVerse",
  },
  twitter: {
    card: "summary_large_image",
    title: "YouTube 4K Video Downloader — Free Online",
    description:
      "Download YouTube videos in 4K, 8K quality. Save Shorts, extract audio, download playlists.",
  },
  alternates: {
    canonical: "https://clipverse.app/youtube",
  },
};

export default function YouTubePage() {
  return <YouTubeContent />;
}
