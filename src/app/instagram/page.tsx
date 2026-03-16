import type { Metadata } from "next";
import InstagramContent from "./content";

export const metadata: Metadata = {
  title: "Instagram Reels & Stories Downloader — Free | ClipVerse",
  description:
    "Download Instagram Reels, Stories, IGTV videos, and photo carousels in HD for free. Save profile pictures in full resolution. No login required, no watermarks.",
  keywords:
    "Instagram downloader, Instagram Reels download, Instagram Stories saver, IGTV downloader, Instagram photo download, Instagram video downloader free",
  openGraph: {
    title: "Instagram Reels & Stories Downloader — Free | ClipVerse",
    description:
      "Download Instagram Reels, Stories, and IGTV in HD. Save carousels and profile pictures. Fast and free.",
    type: "website",
    url: "/instagram",
    siteName: "ClipVerse",
  },
  twitter: {
    card: "summary_large_image",
    title: "Instagram Reels & Stories Downloader — Free",
    description:
      "Download Instagram Reels, Stories, IGTV in HD. Save carousels and profile pictures.",
  },
  alternates: {
    canonical: "/instagram",
  },
};

export default function InstagramPage() {
  return <InstagramContent />;
}
