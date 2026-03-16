import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chrome Extension — One-Click Video Downloads",
  description:
    "Download videos directly from any website with the ClipVerse Chrome extension. One-click downloads, batch support, and 4K quality.",
  keywords: [
    "chrome extension",
    "video downloader extension",
    "browser extension",
    "one-click download",
  ],
  openGraph: {
    title: "ClipVerse Chrome Extension — One-Click Video Downloads",
    description:
      "Download videos directly from any website with one click. Supports 50+ platforms.",
  },
  alternates: { canonical: "/chrome-extension" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
