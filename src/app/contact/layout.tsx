import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with the ClipVerse team. We're here to help with questions, feedback, and support requests.",
  openGraph: {
    title: "Contact Us | ClipVerse",
    description:
      "Get in touch with the ClipVerse team for questions, feedback, and support.",
  },
  alternates: { canonical: "/contact" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
