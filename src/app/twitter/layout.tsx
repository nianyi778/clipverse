import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Twitter / X Video Downloader — Download Tweets with Video",
  description:
    "Download Twitter and X videos, GIFs, and media in HD quality for free. Paste the tweet URL and save instantly.",
  keywords: ["twitter video downloader", "x video downloader", "download twitter video", "save tweet video", "twitter gif download"],
  openGraph: {
    title: "Twitter / X Video Downloader | ClipVerse",
    description:
      "Save videos and GIFs from Twitter / X in HD quality. Free and instant — just paste the tweet URL.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
