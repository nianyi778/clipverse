import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing — Plans for Everyone",
  description:
    "Choose the ClipVerse plan that fits your needs. Free plan available, Pro for power users, Lifetime deal for unlimited access.",
  openGraph: {
    title: "ClipVerse Pricing — Free, Pro & Lifetime Plans",
    description:
      "Start free or upgrade for unlimited downloads, higher quality, and API access. No hidden fees.",
  },
  alternates: { canonical: "/pricing" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
