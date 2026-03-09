import type { Metadata } from "next";
import TikTokContent from "./content";

export const metadata: Metadata = {
  title: "TikTok Video Downloader — HD No Watermark | ClipVerse",
  description:
    "Download TikTok videos without watermark in HD quality. Save TikTok slideshows, extract audio, batch download. Free, fast, no software needed.",
  keywords:
    "TikTok downloader, TikTok no watermark, TikTok video download, TikTok HD download, TikTok audio download, TikTok slideshow download",
  openGraph: {
    title: "TikTok Video Downloader — HD No Watermark | ClipVerse",
    description:
      "Download TikTok videos without watermark in HD. Save slideshows, extract audio, batch download.",
    type: "website",
    url: "https://clipverse.app/tiktok",
    siteName: "ClipVerse",
  },
  twitter: {
    card: "summary_large_image",
    title: "TikTok Video Downloader — HD No Watermark",
    description:
      "Download TikTok videos without watermark in HD quality. Free and fast.",
  },
  alternates: {
    canonical: "https://clipverse.app/tiktok",
  },
};

export default function TikTokPage() {
  return <TikTokContent />;
}
