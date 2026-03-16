import type { Metadata } from "next";
import XiaohongshuContent from "./content";

export const metadata: Metadata = {
  title: "小红书视频下载器 — 无水印高清 | ClipVerse",
  description:
    "免费下载小红书视频和图集，无水印高清画质。支持笔记保存、直播下载、音频提取和批量操作。无需登录，无需安装软件。",
  keywords:
    "小红书下载, 小红书视频下载, 小红书无水印, 小红书图集下载, 小红书笔记保存, 免费小红书下载器",
  openGraph: {
    title: "小红书视频下载器 — 无水印高清 | ClipVerse",
    description:
      "免费下载小红书视频和图集，无水印高清画质。支持笔记保存、直播下载、批量操作。",
    type: "website",
    url: "/xiaohongshu",
    siteName: "ClipVerse",
  },
  twitter: {
    card: "summary_large_image",
    title: "小红书视频下载器 — 无水印高清",
    description:
      "免费下载小红书视频和图集，无水印高清画质。支持笔记保存、直播下载、批量操作。",
  },
  alternates: {
    canonical: "/xiaohongshu",
  },
};

export default function XiaohongshuPage() {
  return <XiaohongshuContent />;
}
