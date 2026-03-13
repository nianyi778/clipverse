import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "API Documentation",
  description:
    "ClipVerse API documentation for developers. Integrate video downloading into your applications with our RESTful API.",
  openGraph: {
    title: "API Documentation | ClipVerse",
    description:
      "Integrate video downloading into your apps with the ClipVerse API.",
  },
  alternates: { canonical: "https://clipverse.app/api-docs" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
