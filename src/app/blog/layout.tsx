import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog — ClipVerse",
  description:
    "Tips, tutorials, and updates from ClipVerse. Learn how to download videos, optimize quality, and get the most from our platform.",
  robots: { index: false, follow: true },
  alternates: { canonical: "/blog" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
