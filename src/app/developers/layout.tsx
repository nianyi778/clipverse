import type { Metadata } from "next";
import { BreadcrumbJsonLd } from "@/lib/breadcrumb";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Developer Platform — REST API & MCP Integration",
  description:
    "Integrate video downloading into your apps with the ClipVerse REST API and MCP (Model Context Protocol) endpoint. API keys, usage dashboard, and OpenAPI docs for developers and AI agents.",
  keywords: [
    "video download API",
    "MCP server",
    "Model Context Protocol",
    "ClipVerse API",
    "developer platform",
    "AI video download",
    "REST API video",
    "LLM tool integration",
  ],
  openGraph: {
    title: "ClipVerse Developer Platform — REST API & MCP for AI",
    description:
      "Build with ClipVerse: REST API for video downloads + MCP endpoint for AI agents. 50+ platforms, 4K quality.",
    type: "website",
    url: "/developers",
    siteName: "ClipVerse",
  },
  twitter: {
    card: "summary_large_image",
    title: "ClipVerse Developer Platform — REST API & MCP",
    description:
      "REST API + Model Context Protocol endpoint for AI-powered video downloading.",
  },
  alternates: { canonical: "/developers" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "ClipVerse Developer API",
  url: `${SITE_URL}/developers`,
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  description:
    "REST API and MCP (Model Context Protocol) endpoint for integrating video downloading into applications and AI agents.",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
    description: "Free tier available with API key",
  },
  featureList: [
    "REST API for video parsing and downloading",
    "MCP endpoint for AI/LLM integration",
    "OpenAPI specification",
    "API key management",
    "50+ platform support",
    "4K video quality",
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BreadcrumbJsonLd items={[{ name: "Developer Platform", path: "/developers" }]} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
