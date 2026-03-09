import type { Metadata } from "next";
import TwitterContent from "./content";

export const metadata: Metadata = {
  title: "Twitter / X Video Downloader — Free Online | ClipVerse",
  description:
    "Download Twitter (X) videos, GIFs, and Spaces audio recordings in HD for free. Save tweet media, thread images, and video content. No login, no watermarks.",
  keywords:
    "Twitter video downloader, X video download, Twitter GIF downloader, Twitter Spaces download, tweet video saver, X video saver free",
  openGraph: {
    title: "Twitter / X Video Downloader — Free Online | ClipVerse",
    description:
      "Download Twitter/X videos, GIFs, and Spaces audio in HD. Save tweet media and threads. Fast and free.",
    type: "website",
    url: "https://clipverse.app/twitter",
    siteName: "ClipVerse",
  },
  twitter: {
    card: "summary_large_image",
    title: "Twitter / X Video Downloader — Free Online",
    description:
      "Download Twitter/X videos, GIFs, Spaces audio in HD. Save tweet media and thread content.",
  },
  alternates: {
    canonical: "https://clipverse.app/twitter",
  },
};

export default function TwitterPage() {
  return <TwitterContent />;
}
