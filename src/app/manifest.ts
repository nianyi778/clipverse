import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ClipVerse — Download Videos from Any Platform",
    short_name: "ClipVerse",
    description:
      "Free HD video downloader for YouTube, TikTok, Instagram, Bilibili & 50+ platforms.",
    start_url: "/",
    display: "standalone",
    background_color: "#000000",
    theme_color: "#000000",
    icons: [
      { src: "/favicon.ico", sizes: "any", type: "image/x-icon" },
    ],
  };
}
