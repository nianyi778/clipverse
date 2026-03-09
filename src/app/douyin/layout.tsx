import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "抖音视频下载 — 无水印免费下载抖音视频",
  description:
    "免费下载抖音视频，去除水印，高清画质。粘贴抖音链接即可保存，无需安装任何软件。",
  keywords: ["抖音下载", "抖音视频下载", "去水印", "抖音无水印下载", "douyin downloader"],
  openGraph: {
    title: "抖音视频下载 — 无水印 | ClipVerse",
    description:
      "免费下载抖音视频，自动去除水印，支持高清画质。粘贴链接，一键保存。",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
