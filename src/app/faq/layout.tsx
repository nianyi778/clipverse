import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ — Frequently Asked Questions",
  description:
    "Find answers to common questions about ClipVerse. Pricing, supported platforms, download quality, Chrome extension, API access, and more.",
  openGraph: {
    title: "FAQ | ClipVerse",
    description:
      "Answers to common questions about ClipVerse video downloader.",
  },
  alternates: { canonical: "https://clipverse.app/faq" },
};

const faqItems = [
  {
    question: "Is ClipVerse free to use?",
    answer:
      "Yes, ClipVerse offers a free tier with 5 downloads per day and up to 1080p quality. For unlimited downloads and 4K quality, upgrade to our Pro plan at just $3.99/month.",
  },
  {
    question: "What platforms does ClipVerse support?",
    answer:
      "We support 50+ platforms including YouTube, TikTok, Instagram, Twitter/X, Bilibili, Xiaohongshu, Douyin, Facebook, Vimeo, and many more.",
  },
  {
    question: "What quality options are available?",
    answer:
      "Free users can download up to 1080p, while Pro users get unlimited 4K quality. We support various codecs and formats including MP4, WebM, and more.",
  },
  {
    question: "How fast are downloads?",
    answer:
      "Download speed depends on your internet connection and the source platform. Pro users get priority speed optimization. Most videos download within seconds to minutes.",
  },
  {
    question: "Is my data private and secure?",
    answer:
      "Yes, we take privacy seriously. All data is encrypted in transit and at rest. We never store your downloaded videos on our servers.",
  },
  {
    question: "Do you have a Chrome extension?",
    answer:
      "Yes! Our Chrome extension allows one-click downloads directly from video pages. Pro users get access to the extension with additional features like batch downloading.",
  },
  {
    question: "Is there an API available?",
    answer:
      "Yes, we offer an API for developers. Pro and Lifetime users get API access. Check our API documentation for integration details and rate limits.",
  },
  {
    question: "Can I download multiple videos at once?",
    answer:
      "Pro users can batch download up to 10 videos at once. This saves time when you need to download multiple videos from the same platform.",
  },
  {
    question: "Do you support subtitle downloads?",
    answer:
      "Yes, Pro users can download subtitles in multiple languages. We also offer AI-powered subtitle generation for videos without existing subtitles.",
  },
  {
    question: "How do I manage my account?",
    answer:
      "Log in to your account to manage subscriptions, view download history, and adjust privacy settings. You can upgrade, downgrade, or cancel your subscription anytime.",
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqItems.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  })),
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      {children}
    </>
  );
}
