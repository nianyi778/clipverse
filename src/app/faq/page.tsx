"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Navbar } from "@/components/navbar";

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "Is ClipVerse free to use?",
    answer:
      "Yes, ClipVerse offers a free tier with 5 downloads per day and up to 1080p quality. For unlimited downloads and 4K quality, upgrade to our Pro plan at just $3.99/month.",
  },
  {
    question: "What platforms does ClipVerse support?",
    answer:
      "We support 50+ platforms including YouTube, TikTok, Instagram, Twitter/X, Bilibili, 小红书, 抖音, Facebook, Vimeo, and many more. Check our download page for the complete list.",
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
      "Yes, we take privacy seriously. All data is encrypted in transit and at rest. We never store your downloaded videos on our servers. Check our privacy policy for details.",
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

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="relative min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-3xl px-6 pb-24 pt-32">
        <motion.div
          className="mb-12 text-center"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="mb-3 text-3xl font-bold text-white">Frequently Asked Questions</h1>
          <p className="text-white/40">Find answers to common questions about ClipVerse</p>
        </motion.div>

        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <motion.div
              key={faq.question}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <button
                type="button"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full rounded-lg border border-white/[0.06] bg-white/[0.02] px-5 py-4 text-left transition-all hover:border-white/[0.12] hover:bg-white/[0.04]"
              >
                <div className="flex items-center justify-between gap-4">
                  <h3 className="text-sm font-semibold text-white/80">{faq.question}</h3>
                  <ChevronDown
                    className={cn(
                      "size-4 shrink-0 text-white/40 transition-transform duration-300",
                      openIndex === index && "rotate-180"
                    )}
                  />
                </div>
              </button>

              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="border-b border-l border-r border-white/[0.06] bg-white/[0.01] px-5 py-4 text-sm leading-relaxed text-white/50">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
}
