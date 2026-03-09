import type { Metadata } from "next";
import FacebookContent from "./content";

export const metadata: Metadata = {
  title: "Facebook Video Downloader — Free HD | ClipVerse",
  description:
    "Download Facebook videos in Full HD and 4K for free. Save FB Reels, Stories, Live replays, and shared videos. No software installation, no login required.",
  keywords:
    "Facebook video downloader, FB video download, Facebook Reels download, Facebook Stories saver, Facebook Live download, free Facebook video downloader",
  openGraph: {
    title: "Facebook Video Downloader — Free HD | ClipVerse",
    description:
      "Download Facebook videos in HD and 4K. Save Reels, Stories, and Live replays. Fast and free.",
    type: "website",
    url: "https://clipverse.app/facebook",
    siteName: "ClipVerse",
  },
  twitter: {
    card: "summary_large_image",
    title: "Facebook Video Downloader — Free HD",
    description:
      "Download Facebook videos in HD and 4K. Save Reels, Stories, Live replays.",
  },
  alternates: {
    canonical: "https://clipverse.app/facebook",
  },
};

export default function FacebookPage() {
  return <FacebookContent />;
}
