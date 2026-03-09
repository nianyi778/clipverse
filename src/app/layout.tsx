import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "@/components/providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = "https://clipverse-tan.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "ClipVerse — Download Videos from Any Platform",
    template: "%s | ClipVerse",
  },
  description:
    "Free HD video downloader for YouTube, TikTok, Instagram, Bilibili & 50+ platforms. 4K quality, no watermark, no software needed.",
  keywords: [
    "video downloader",
    "youtube downloader",
    "tiktok downloader",
    "instagram downloader",
    "bilibili downloader",
    "4k video download",
    "no watermark",
    "free video downloader",
  ],
  authors: [{ name: "ClipVerse" }],
  creator: "ClipVerse",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "ClipVerse",
    title: "ClipVerse — Download Videos from Any Platform",
    description:
      "Free HD video downloader for YouTube, TikTok, Instagram, Bilibili & 50+ platforms. 4K quality, no watermark.",
  },
  twitter: {
    card: "summary_large_image",
    title: "ClipVerse — Download Videos from Any Platform",
    description:
      "Free HD video downloader for YouTube, TikTok, Instagram, Bilibili & 50+ platforms. 4K quality, no watermark.",
    creator: "@clipverse",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`dark ${geistSans.variable} ${geistMono.variable}`}>
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
