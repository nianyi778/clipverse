import type { Metadata } from "next";
import DouyinContent from "./content";

export const metadata: Metadata = {
  title: "抖音视频下载器 — 无水印免费下载 | ClipVerse",
  description:
    "免费下载抖音视频，去水印、高清原画质量。支持音频提取、图集保存、批量下载和直播回放。无需登录，无需安装软件。",
  keywords:
    "抖音下载, 抖音视频下载, 抖音无水印下载, 抖音去水印, 抖音音频提取, 抖音图集下载, 免费抖音下载器",
  openGraph: {
    title: "抖音视频下载器 — 无水印免费下载 | ClipVerse",
    description:
      "免费下载抖音视频，去水印高清原画。支持音频提取、图集保存、批量下载。",
    type: "website",
    url: "https://clipverse.app/douyin",
    siteName: "ClipVerse",
  },
  twitter: {
    card: "summary_large_image",
    title: "抖音视频下载器 — 无水印免费下载",
    description:
      "免费下载抖音视频，去水印高清原画。支持音频提取、图集保存、批量下载。",
  },
  alternates: {
    canonical: "https://clipverse.app/douyin",
  },
};

export default function DouyinPage() {
  return <DouyinContent />;
}
