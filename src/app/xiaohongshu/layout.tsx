import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "小红书视频下载 — 免费下载小红书视频图片",
  description:
    "免费下载小红书视频和图片，去除水印，高清画质。粘贴小红书链接即可保存，无需安装软件。",
  keywords: ["小红书下载", "小红书视频下载", "小红书无水印", "红书图片下载", "xiaohongshu downloader"],
  openGraph: {
    title: "小红书视频下载 — 无水印 | ClipVerse",
    description:
      "免费下载小红书视频和图片，自动去除水印。粘贴链接，高清保存。",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
