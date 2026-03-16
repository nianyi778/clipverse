import type { Metadata } from "next";
import Script from "next/script";
import { cookies, headers } from "next/headers";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "@/components/providers";
import { DEFAULT_LOCALE, detectLocale, LOCALE_COOKIE_NAME } from "@/lib/locale";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

const GA_ID = "G-K97D0JLSGK";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = SITE_URL;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "ClipVerse — Download Videos from Any Platform",
    template: "%s | ClipVerse",
  },
  description:
    "Free HD video downloader for YouTube, TikTok, Instagram, Bilibili & 50+ platforms. 4K quality, no watermark. Developer API & MCP endpoint for AI integration.",
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const headerStore = await headers();
  const initialLocale = detectLocale(
    [
      cookieStore.get(LOCALE_COOKIE_NAME)?.value,
      headerStore.get("accept-language"),
    ],
    DEFAULT_LOCALE
  );

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        name: "ClipVerse",
        url: siteUrl,
        logo: `${siteUrl}/logo.png`,
        sameAs: [],
        contactPoint: {
          "@type": "ContactPoint",
          email: "support@clipverse.app",
          contactType: "customer service",
        },
      },
      {
        "@type": "WebApplication",
        name: "ClipVerse",
        url: siteUrl,
        applicationCategory: "MultimediaApplication",
        operatingSystem: "Any",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
        description:
          "Free HD video downloader for YouTube, TikTok, Instagram, Bilibili & 50+ platforms.",
      },
    ],
  };

  return (
    <html lang={initialLocale} className={`dark ${geistSans.variable} ${geistMono.variable}`}>
      <head>
        <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
        <Script id="gtag-init" strategy="afterInteractive">
          {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${GA_ID}')`}
        </Script>
      </head>
      <body className="antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Providers initialLocale={initialLocale}>{children}</Providers>
      </body>
    </html>
  );
}
