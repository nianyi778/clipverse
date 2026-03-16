import type { Metadata } from "next";
import BilibiliContent from "./content";

export const metadata: Metadata = {
  title: "Bilibili Video Downloader — 4K + VIP Content | ClipVerse",
  description:
    "Download Bilibili videos in 4K and Dolby Vision. Access VIP/大会员 content without login. Multi-part episodes, danmaku subtitles, bangumi support. Free online.",
  keywords:
    "Bilibili downloader, Bilibili 4K download, Bilibili VIP download, B站下载, 大会员视频下载, Bilibili danmaku, Bilibili bangumi download",
  openGraph: {
    title: "Bilibili Video Downloader — 4K + VIP Content | ClipVerse",
    description:
      "Download Bilibili videos in 4K, Dolby Vision. VIP content without login. Episodes, danmaku, bangumi.",
    type: "website",
    url: "/bilibili",
    siteName: "ClipVerse",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bilibili Video Downloader — 4K + VIP Content",
    description:
      "Download Bilibili videos in 4K, Dolby Vision. VIP/大会员 content without login.",
  },
  alternates: {
    canonical: "/bilibili",
  },
};

export default function BilibiliPage() {
  return <BilibiliContent />;
}
