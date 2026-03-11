"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Download,
  MonitorPlay,
  Layers,
  Chrome,
  Subtitles,
  Check,
  Zap,
  Send,
  Star,
  ChevronDown,
  Search,
  Loader2,
  Copy,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Navbar } from "@/components/navbar";
import { useI18n } from "@/lib/i18n";

/* ─── Types ─── */

type IconComponent = typeof Download;

interface Feature {
  icon: IconComponent;
  title: string;
  description: string;
}

interface PricingTier {
  name: string;
  price: string;
  originalPrice?: string;
  period: string;
  description: string;
  features: string[];
  cta: string;
  highlighted: boolean;
  badge?: string;
  badgeGradient?: string;
}

/* ─── Animation Variants ─── */

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

/* ─── Static Data ─── */

const platforms = [
  "YouTube",
  "TikTok",
  "Instagram",
  "Twitter / X",
  "Bilibili",
  "小红书",
  "抖音",
  "Facebook",
  "Threads",
  "Pinterest",
  "Vimeo",
];

const features: Feature[] = [
  {
    icon: MonitorPlay,
    title: "features.4k.title",
    description: "features.4k.desc",
  },
  {
    icon: Layers,
    title: "features.batch.title",
    description: "features.batch.desc",
  },
  {
    icon: Chrome,
    title: "features.extension.title",
    description: "features.extension.desc",
  },
  {
    icon: Subtitles,
    title: "features.subtitles.title",
    description: "features.subtitles.desc",
  },
];

const pricingTiers: PricingTier[] = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for casual downloads",
    features: [
      "5 downloads / day",
      "Up to 1080p quality",
      "Standard speed",
      "Basic format options",
    ],
    cta: "Get Started Free",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$3.99",
    period: "/month",
    description: "For power users who need more",
    features: [
      "Unlimited downloads",
      "Up to 4K quality",
      "Batch download (10 at once)",
      "Chrome Extension",
      "Priority speed",
      "All formats & codecs",
    ],
    cta: "Start Pro Trial",
    highlighted: true,
    badge: "Most Popular",
    badgeGradient: "from-violet-600 to-purple-600",
  },
  {
    name: "Lifetime",
    price: "$29.99",
    originalPrice: "$49.99",
    period: "one-time",
    description: "Everything, forever. No recurring fees.",
    features: [
      "Everything in Pro",
      "Lifetime updates",
      "AI Subtitles",
      "API access",
      "Priority support",
    ],
    cta: "Buy Lifetime",
    highlighted: false,
    badge: "Best Value",
    badgeGradient: "from-emerald-500 to-teal-500",
  },
];

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Content Creator",
    quote:
      "ClipVerse replaced 3 different tools I was juggling. The batch download feature alone saves me hours every week when repurposing content.",
    stars: 5,
    gradient: "from-violet-500 to-purple-600",
  },
  {
    name: "Marcus Rivera",
    role: "Film Student",
    quote:
      "Finally a downloader that actually delivers real 4K quality. The codec options are exactly what I needed for my editing projects.",
    stars: 5,
    gradient: "from-fuchsia-500 to-pink-600",
  },
  {
    name: "Yuki Tanaka",
    role: "Social Media Manager",
    quote:
      "Managing content across 6 platforms used to be a nightmare. The Chrome extension makes it one-click easy.",
    stars: 5,
    gradient: "from-cyan-500 to-blue-600",
  },
  {
    name: "Alex Thompson",
    role: "Freelance Editor",
    quote:
      "The AI subtitle extraction is incredibly accurate. Saved my project deadline with translations in minutes, not hours.",
    stars: 4,
    gradient: "from-amber-500 to-orange-600",
  },
];

const faqs = [
  {
    question: "Is ClipVerse free to use?",
    answer:
      "Yes! Our free tier includes 5 downloads per day at up to 1080p quality. No credit card required. Upgrade to Pro or Lifetime for unlimited downloads and 4K quality.",
  },
  {
    question: "Which platforms are supported?",
    answer:
      "We support 11+ platforms including YouTube, TikTok, Instagram, Twitter/X, Bilibili, 小红书, 抖音, Facebook, Threads, Pinterest, and Vimeo. We regularly add new platforms based on user requests.",
  },
  {
    question: "What video quality options are available?",
    answer:
      "Free users can download up to 1080p. Pro and Lifetime plans unlock 4K Ultra HD with multiple codec options including AV1, VP9, and H.264. Audio-only downloads are also available.",
  },
  {
    question: "Do I need to install any software?",
    answer:
      "No installation needed — ClipVerse works entirely in your browser. We also offer an optional Chrome extension that adds a one-click download button directly on video pages.",
  },
  {
    question: "How does batch downloading work?",
    answer:
      "Pro and Lifetime users can queue up to 10 videos simultaneously. Paste multiple URLs, select your preferred quality for each, and let ClipVerse handle the rest with built-in queue management.",
  },
  {
    question: "Is it legal to download videos?",
    answer:
      "ClipVerse is designed for downloading content you have rights to access, such as your own uploads or Creative Commons content. Always respect copyright and platform terms of service.",
  },
  {
    question: "What about AI subtitles?",
    answer:
      "Our Lifetime plan includes AI-powered subtitle extraction supporting 50+ languages. Download subtitles as SRT files or embed them directly into your videos.",
  },
  {
    question: "Is my data and privacy safe?",
    answer:
      "We take privacy seriously. Downloaded videos are never stored on our servers — all processing happens in real-time. We don't log URLs or track your download history.",
  },
];

/* ─── Platform Logos ─── */

const platformLogos: Record<string, React.ReactNode> = {
  YouTube: (
    <svg viewBox="0 0 24 24" className="size-5 fill-current">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  ),
  TikTok: (
    <svg viewBox="0 0 24 24" className="size-5 fill-current">
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
    </svg>
  ),
  Instagram: (
    <svg viewBox="0 0 24 24" className="size-5 fill-current">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
    </svg>
  ),
  "Twitter / X": (
    <svg viewBox="0 0 24 24" className="size-5 fill-current">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  ),
  Bilibili: (
    <svg viewBox="0 0 24 24" className="size-5 fill-current">
      <path d="M17.813 4.653h.854c1.51.054 2.769.578 3.773 1.574 1.004.995 1.524 2.249 1.56 3.76v7.36c-.036 1.51-.556 2.769-1.56 3.773s-2.262 1.524-3.773 1.56H5.333c-1.51-.036-2.769-.556-3.773-1.56S.036 18.858 0 17.347v-7.36c.036-1.511.556-2.765 1.56-3.76 1.004-.996 2.262-1.52 3.773-1.574h.774l-1.174-1.12a1.234 1.234 0 0 1-.373-.906c0-.356.124-.658.373-.907l.027-.027c.267-.249.573-.373.92-.373.347 0 .653.124.92.373L9.653 4.44c.071.071.134.142.187.213h4.267a.836.836 0 0 1 .16-.213l2.853-2.747c.267-.249.573-.373.92-.373.347 0 .662.151.929.4.267.249.391.551.391.907 0 .355-.124.657-.373.906zM5.333 7.24c-.746.018-1.373.276-1.88.773-.506.498-.769 1.13-.786 1.894v7.52c.017.764.28 1.395.786 1.893.507.498 1.134.756 1.88.773h13.334c.746-.017 1.373-.275 1.88-.773.506-.498.769-1.129.786-1.893v-7.52c-.017-.765-.28-1.396-.786-1.894-.507-.497-1.134-.755-1.88-.773zM8 11.107c.373 0 .684.124.933.373.25.249.383.569.4.96v1.173c-.017.391-.15.711-.4.96-.249.25-.56.374-.933.374s-.684-.125-.933-.374c-.25-.249-.383-.569-.4-.96V12.44c.017-.391.15-.711.4-.96.249-.249.56-.373.933-.373zm8 0c.373 0 .684.124.933.373.25.249.383.569.4.96v1.173c-.017.391-.15.711-.4.96-.249.25-.56.374-.933.374s-.684-.125-.933-.374c-.25-.249-.383-.569-.4-.96V12.44c.017-.391.15-.711.4-.96.249-.249.56-.373.933-.373z" />
    </svg>
  ),
  "\u5c0f\u7ea2\u4e66": (
    <svg viewBox="0 0 24 24" className="size-5 fill-current">
      <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.2 14.4H7.8c-.7 0-1.2-.5-1.2-1.2V8.8c0-.7.5-1.2 1.2-1.2h8.4c.7 0 1.2.5 1.2 1.2v6.4c0 .7-.5 1.2-1.2 1.2zm-5.4-7.8c-.6 0-1.1.5-1.1 1.1v3.6c0 .6.5 1.1 1.1 1.1s1.1-.5 1.1-1.1V9.7c0-.6-.5-1.1-1.1-1.1zm3.6 0c-.6 0-1.1.5-1.1 1.1v3.6c0 .6.5 1.1 1.1 1.1s1.1-.5 1.1-1.1V9.7c0-.6-.5-1.1-1.1-1.1z" />
    </svg>
  ),
  "\u6296\u97f3": (
    <svg viewBox="0 0 24 24" className="size-5 fill-current">
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
    </svg>
  ),
  Facebook: (
    <svg viewBox="0 0 24 24" className="size-5 fill-current">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  ),
  Threads: (
    <svg viewBox="0 0 24 24" className="size-5 fill-current">
      <path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.589 12c.027 3.086.718 5.496 2.057 7.164 1.43 1.783 3.631 2.698 6.54 2.717 2.623-.02 4.358-.631 5.8-2.045 1.647-1.613 1.618-3.593 1.09-4.798-.31-.71-.873-1.3-1.634-1.75-.192 1.352-.622 2.446-1.284 3.272-.886 1.102-2.14 1.704-3.73 1.79-1.202.065-2.361-.218-3.259-.801-1.063-.689-1.685-1.74-1.752-2.96-.065-1.187.408-2.264 1.33-3.03.858-.712 2.042-1.121 3.425-1.19 1.007-.05 1.94.025 2.803.2-.086-.643-.263-1.178-.53-1.594-.392-.612-1.003-.929-1.816-.943h-.063c-.61 0-1.38.168-1.94.642l-1.37-1.544c.908-.804 2.108-1.227 3.37-1.22 1.305.024 2.353.501 3.115 1.42.668.806 1.074 1.882 1.212 3.2.399.1.768.222 1.103.369 1.15.504 2.074 1.314 2.672 2.343.782 1.344.956 3.268-.12 5.327C19.51 22.227 16.762 23.969 12.186 24zm-.09-8.876c-1.026.052-1.833.326-2.334.793-.37.345-.554.762-.534 1.207.04.716.527 1.353 1.338 1.747.614.298 1.355.42 2.143.372 1.089-.063 1.91-.465 2.438-1.2.413-.575.68-1.36.786-2.326-.877-.23-1.836-.357-2.838-.357-.342 0-.685.017-1 .05v-.286z" />
    </svg>
  ),
  Pinterest: (
    <svg viewBox="0 0 24 24" className="size-5 fill-current">
      <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12.017 24c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z" />
    </svg>
  ),
  Vimeo: (
    <svg viewBox="0 0 24 24" className="size-5 fill-current">
      <path d="M23.977 6.416c-.105 2.338-1.739 5.543-4.894 9.609-3.268 4.247-6.026 6.37-8.29 6.37-1.409 0-2.578-1.294-3.553-3.881L5.322 11.4C4.603 8.816 3.834 7.522 3.01 7.522c-.179 0-.806.378-1.881 1.132L0 7.197a315.065 315.065 0 0 0 3.501-3.128C5.08 2.701 6.266 1.984 7.055 1.91c1.867-.18 3.016 1.1 3.447 3.838.465 2.953.789 4.789.971 5.507.539 2.45 1.131 3.674 1.776 3.674.502 0 1.256-.796 2.265-2.385 1.004-1.589 1.54-2.797 1.612-3.628.144-1.371-.395-2.061-1.614-2.061-.574 0-1.167.121-1.777.391 1.186-3.868 3.434-5.757 6.762-5.637 2.473.06 3.628 1.664 3.493 4.797l-.013.01z" />
    </svg>
  ),
};

/* ─── Sub-components ─── */

function MarqueeItem({ name }: { name: string }) {
  const logo = platformLogos[name];
  return (
    <div className="flex items-center gap-2.5 whitespace-nowrap px-8 text-sm font-medium text-white/30 transition-colors hover:text-white/50">
      {logo ? (
        <span className="shrink-0 text-white/20">{logo}</span>
      ) : (
        <span className="size-1.5 shrink-0 rounded-full bg-violet-500/40" />
      )}
      {name}
    </div>
  );
}

function PlatformMarqueeRow({ prefix }: { prefix: string }) {
  return (
    <div className="flex shrink-0 animate-marquee">
      {platforms.map((platform) => (
        <MarqueeItem key={`${prefix}-a-${platform}`} name={platform} />
      ))}
      {platforms.map((platform) => (
        <MarqueeItem key={`${prefix}-b-${platform}`} name={platform} />
      ))}
    </div>
  );
}

function ProcessAnimation() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((prev) => (prev + 1) % 3);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative mx-auto w-full max-w-sm">
      <div className="absolute -inset-6 rounded-3xl bg-gradient-to-br from-violet-600/20 via-purple-600/10 to-fuchsia-600/15 blur-3xl" />

      <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-xl">
        <div className="flex items-center gap-2 border-b border-white/[0.06] px-4 py-3">
          <div className="size-2.5 rounded-full bg-white/10" />
          <div className="size-2.5 rounded-full bg-white/10" />
          <div className="size-2.5 rounded-full bg-white/10" />
          <div className="ml-2 flex h-5 flex-1 items-center rounded-md bg-white/[0.04] px-3">
            <span className="text-[10px] text-white/20">
              clipverse.app/download
            </span>
          </div>
        </div>

        <div className="relative min-h-[160px] p-5">
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div
                key="analyze"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="space-y-4"
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-violet-500/15 p-2.5">
                    <Search className="size-5 animate-pulse text-violet-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white/80">
                      Analyzing URL
                    </p>
                    <p className="text-xs text-white/30">
                      Detecting platform...
                    </p>
                  </div>
                </div>
                <div className="rounded-lg bg-white/[0.03] px-3 py-2">
                  <p className="truncate font-mono text-xs text-white/25">
                    https://youtube.com/watch?v=dQw4w9W...
                  </p>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-violet-500 to-purple-500"
                    initial={{ width: "0%" }}
                    animate={{ width: "55%" }}
                    transition={{ duration: 1.8, ease: "easeOut" }}
                  />
                </div>
              </motion.div>
            )}

            {step === 1 && (
              <motion.div
                key="process"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="space-y-4"
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-purple-500/15 p-2.5">
                    <Loader2 className="size-5 animate-spin text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white/80">
                      Processing Video
                    </p>
                    <p className="text-xs text-white/30">
                      Extracting 1080p MP4...
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-white/40">video_1080p.mp4</span>
                    <span className="text-purple-400">70%</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-purple-500 to-fuchsia-500"
                      initial={{ width: "0%" }}
                      animate={{ width: "70%" }}
                      transition={{ duration: 1.4, ease: "easeOut" }}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-3 text-xs text-white/25">
                  <span>24.5 MB</span>
                  <span className="size-0.5 rounded-full bg-white/20" />
                  <span>Duration: 3:42</span>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="ready"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="space-y-4"
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-emerald-500/15 p-2.5">
                    <Check className="size-5 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-emerald-400">
                      Download Ready
                    </p>
                    <p className="text-xs text-white/30">
                      video_1080p.mp4 — 24.5 MB
                    </p>
                  </div>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                  <div className="h-full w-full rounded-full bg-gradient-to-r from-emerald-500 to-green-500" />
                </div>
                <motion.div
                  initial={{ scale: 0.96 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.2 }}
                  className="flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-violet-600 to-purple-600 py-2.5 text-sm font-medium text-white"
                >
                  <Download className="size-4" />
                  Save to Device
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex items-center justify-center gap-2 border-t border-white/[0.04] py-3">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={cn(
                "h-1 rounded-full transition-all duration-500",
                step === i ? "w-6 bg-violet-500" : "w-1.5 bg-white/15"
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function FAQItem({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-white/[0.06]">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full cursor-pointer items-center justify-between gap-4 py-5 text-left"
      >
        <span className="text-base font-medium text-white/80">
          {question}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="shrink-0"
        >
          <ChevronDown className="size-5 text-white/30" />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-sm leading-relaxed text-white/40">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Main Page ─── */

export default function Home() {
  const { t } = useI18n();
  const [url, setUrl] = useState("");
  const router = useRouter();

  const handleDownload = () => {
    const trimmed = url.trim();
    if (!trimmed) return;
    const match = trimmed.match(
      /https?:\/\/[^\s\u3000-\u9fff\uff00-\uffef\u{1F000}-\u{1FFFF}]+/u
    );
    const cleanUrl = match
      ? match[0].replace(/[^\w\-._~:/?#[\]@!$&'()*+,;=%]+$/, "")
      : trimmed;
    router.push(`/download?url=${encodeURIComponent(cleanUrl)}`);
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <Navbar />

      {/* ────── HERO ────── */}
      <section className="relative px-6 pt-32 pb-20 md:pt-40 md:pb-24">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-1/4 top-[18%] h-[600px] w-[800px] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(ellipse,rgba(124,58,237,0.15)_0%,transparent_70%)]" />
          <div className="absolute right-0 top-[30%] h-[500px] w-[500px] bg-[radial-gradient(ellipse,rgba(6,182,212,0.07)_0%,transparent_70%)]" />
          <div className="absolute bottom-[20%] left-0 h-[400px] w-[400px] bg-[radial-gradient(ellipse,rgba(168,85,247,0.06)_0%,transparent_70%)]" />
          <div
            className="absolute inset-0 opacity-[0.025]"
            style={{
              backgroundImage:
                "radial-gradient(rgba(255,255,255,0.7) 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          />
        </div>

        <div className="relative z-10 mx-auto max-w-6xl">
          <div className="grid items-center gap-12 md:grid-cols-2 md:gap-10 lg:gap-16">
            <motion.div
              className="text-center md:text-left"
              initial="hidden"
              animate="visible"
              variants={stagger}
            >
              <motion.div variants={fadeInUp} transition={{ duration: 0.5 }}>
                <span className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.04] px-4 py-1.5 text-xs text-white/50 backdrop-blur-sm">
                  <Zap className="size-3 text-violet-400" />
                  Trusted by 200K+ users worldwide
                </span>
              </motion.div>

              <motion.h1
                variants={fadeInUp}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="mb-6 text-4xl font-bold leading-[1.08] tracking-tight text-white sm:text-5xl md:text-5xl lg:text-6xl"
              >
                {t("home.title")}
              </motion.h1>

              <motion.p
                variants={fadeInUp}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mx-auto mb-10 max-w-lg text-lg leading-relaxed text-white/45 md:mx-0 md:text-xl"
              >
                {t("home.subtitle")}
              </motion.p>

              <motion.div
                variants={fadeInUp}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="relative mx-auto mb-5 max-w-lg md:mx-0"
              >
                <div className="group relative">
                  <div className="absolute -inset-1 animate-glow rounded-2xl bg-gradient-to-r from-violet-600/25 via-purple-600/25 to-fuchsia-600/25 blur-xl transition-opacity duration-500 group-hover:opacity-100" />
                  <div className="relative flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.04] p-2 backdrop-blur-sm transition-colors duration-300 hover:border-violet-500/25">
                    <input
                      type="url"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleDownload();
                      }}
                      placeholder={t("home.input")}
                      className="min-w-0 flex-1 bg-transparent px-4 py-3 text-base text-white outline-none placeholder:text-white/25"
                    />
                    <button
                      type="button"
                      onClick={handleDownload}
                      className="flex shrink-0 cursor-pointer items-center gap-2 rounded-lg bg-gradient-to-r from-violet-600 to-purple-600 px-6 py-3 text-sm font-semibold text-white transition-all hover:from-violet-500 hover:to-purple-500 hover:shadow-[0_0_30px_rgba(124,58,237,0.35)] active:scale-[0.98]"
                    >
                      <Download className="size-4" />
                      <span className="hidden sm:inline">
                        {t("home.download")}
                      </span>
                    </button>
                  </div>
                </div>
              </motion.div>

              <motion.p
                variants={fadeInUp}
                transition={{ duration: 0.4, delay: 0.4 }}
                className="text-sm text-white/25"
              >
                {t("home.cta")}
              </motion.p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="flex justify-center"
            >
              <ProcessAnimation />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ────── PLATFORM MARQUEE ────── */}
      <section className="relative border-y border-white/[0.04] py-10">
        <div
          className="pointer-events-none absolute inset-0 z-10"
          style={{
            background:
              "linear-gradient(90deg, var(--background) 0%, transparent 12%, transparent 88%, var(--background) 100%)",
          }}
        />
        <div className="flex overflow-hidden">
          <PlatformMarqueeRow prefix="r1" />
          <PlatformMarqueeRow prefix="r2" />
        </div>
      </section>

      {/* ────── HOW IT WORKS ────── */}
      <section className="relative px-6 py-24 md:py-32">
        <div className="mx-auto max-w-5xl">
          <motion.div
            className="mb-16 text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={stagger}
          >
            <motion.p
              variants={fadeInUp}
              className="mb-3 text-sm font-medium uppercase tracking-widest text-emerald-400"
            >
              How It Works
            </motion.p>
            <motion.h2
              variants={fadeInUp}
              className="text-3xl font-bold tracking-tight text-white md:text-4xl lg:text-5xl"
            >
              Three steps. That&apos;s it.
            </motion.h2>
          </motion.div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
            {[
              {
                step: 1,
                icon: Copy,
                title: "Copy Link",
                description:
                  "Find a video on any supported platform and copy its URL from the browser or share menu.",
              },
              {
                step: 2,
                icon: Search,
                title: "Paste & Analyze",
                description:
                  "Paste the URL into ClipVerse. We instantly detect the platform, quality options, and formats.",
              },
              {
                step: 3,
                icon: Download,
                title: "Download",
                description:
                  "Choose your preferred quality and format. Click download. Done in seconds.",
              },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.12 }}
                  className="group relative rounded-2xl border border-white/[0.05] bg-white/[0.02] p-8 text-center transition-all duration-500 hover:border-violet-500/20 hover:bg-white/[0.035]"
                >
                  <div className="pointer-events-none absolute -inset-px rounded-2xl bg-gradient-to-b from-violet-500/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  <div className="relative">
                    <div className="mx-auto mb-5 flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500/15 to-purple-500/15">
                      <span className="text-2xl font-bold text-violet-400">
                        {item.step}
                      </span>
                    </div>
                    <div className="mb-3 inline-flex rounded-xl bg-violet-500/10 p-2.5">
                      <Icon className="size-5 text-violet-400" />
                    </div>
                    <h3 className="mb-2 text-lg font-semibold text-white/90">
                      {item.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-white/40">
                      {item.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ────── FEATURES ────── */}
      <section className="relative px-6 py-24 md:py-32">
        <div className="mx-auto max-w-6xl">
          <motion.div
            className="mb-16 text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={stagger}
          >
            <motion.p
              variants={fadeInUp}
              className="mb-3 text-sm font-medium uppercase tracking-widest text-violet-400"
            >
              Features
            </motion.p>
            <motion.h2
              variants={fadeInUp}
              className="text-3xl font-bold tracking-tight text-white md:text-4xl lg:text-5xl"
            >
              {t("features.title")}
            </motion.h2>
          </motion.div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className="group relative cursor-pointer rounded-2xl border border-white/[0.05] bg-white/[0.02] p-8 transition-all duration-500 hover:border-violet-500/20 hover:bg-white/[0.035]"
                >
                  <div className="pointer-events-none absolute -inset-px rounded-2xl bg-gradient-to-b from-violet-500/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  <div className="relative">
                    <div className="mb-5 inline-flex rounded-xl bg-violet-500/10 p-3">
                      <Icon className="size-6 text-violet-400" />
                    </div>
                    <h3 className="mb-2 text-lg font-semibold text-white/90">
                      {t(feature.title)}
                    </h3>
                    <p className="text-sm leading-relaxed text-white/40">
                      {t(feature.description)}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ────── SOCIAL PROOF ────── */}
      <section className="relative px-6 py-24 md:py-32">
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[400px] w-[600px] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(ellipse,rgba(168,85,247,0.06)_0%,transparent_70%)]" />

        <div className="relative mx-auto max-w-5xl">
          <motion.div
            className="mb-16 text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={stagger}
          >
            <motion.p
              variants={fadeInUp}
              className="mb-3 text-sm font-medium uppercase tracking-widest text-pink-400"
            >
              Testimonials
            </motion.p>
            <motion.h2
              variants={fadeInUp}
              className="mb-4 text-3xl font-bold tracking-tight text-white md:text-4xl lg:text-5xl"
            >
              Loved by creators worldwide
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="mx-auto max-w-xl text-lg text-white/40"
            >
              Join thousands of content creators, editors, and social media
              managers who trust ClipVerse daily.
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {testimonials.map((item, i) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group relative rounded-2xl border border-white/[0.05] bg-white/[0.02] p-7 transition-all duration-500 hover:border-white/[0.1] hover:bg-white/[0.035]"
              >
                <div className="pointer-events-none absolute -inset-px rounded-2xl bg-gradient-to-b from-violet-500/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <div className="relative">
                  <div className="mb-4 flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={`${item.name}-star-${star}`}
                        className={cn(
                          "size-4",
                          star <= item.stars
                            ? "fill-amber-400 text-amber-400"
                            : "fill-white/10 text-white/10"
                        )}
                      />
                    ))}
                  </div>

                  <p className="mb-5 text-sm leading-relaxed text-white/50">
                    &ldquo;{item.quote}&rdquo;
                  </p>

                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "flex size-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br font-semibold text-white/90",
                        item.gradient
                      )}
                    >
                      {item.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white/80">
                        {item.name}
                      </p>
                      <p className="text-xs text-white/30">{item.role}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ────── PRICING ────── */}
      <section id="pricing" className="relative px-6 py-24 md:py-32">
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[700px] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(ellipse,rgba(124,58,237,0.07)_0%,transparent_70%)]" />

        <div className="relative mx-auto max-w-5xl">
          <motion.div
            className="mb-16 text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={stagger}
          >
            <motion.p
              variants={fadeInUp}
              className="mb-3 text-sm font-medium uppercase tracking-widest text-cyan-400"
            >
              Pricing
            </motion.p>
            <motion.h2
              variants={fadeInUp}
              className="mb-4 text-3xl font-bold tracking-tight text-white md:text-4xl lg:text-5xl"
            >
              {t("pricing.title")}
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="mx-auto max-w-xl text-lg text-white/40"
            >
              Start free. Upgrade when you need more power.
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-5">
            {pricingTiers.map((tier, i) => (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className={cn(
                  "relative rounded-2xl border p-8 transition-all duration-300",
                  tier.highlighted
                    ? "border-violet-500/25 bg-violet-500/[0.04] md:scale-[1.03]"
                    : "border-white/[0.05] bg-white/[0.02] hover:border-white/[0.08]"
                )}
              >
                {tier.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span
                      className={cn(
                        "rounded-full bg-gradient-to-r px-4 py-1 text-xs font-semibold text-white",
                        tier.badgeGradient || "from-violet-600 to-purple-600"
                      )}
                    >
                      {tier.badge}
                    </span>
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="mb-1 text-lg font-semibold text-white/80">
                    {tier.name}
                  </h3>
                  <p className="mb-4 text-sm text-white/30">
                    {tier.description}
                  </p>
                  <div className="flex items-baseline gap-2">
                    {tier.originalPrice && (
                      <span className="text-lg text-white/30 line-through">
                        {tier.originalPrice}
                      </span>
                    )}
                    <span className="text-4xl font-bold text-white">
                      {tier.price}
                    </span>
                    <span className="text-sm text-white/30">{tier.period}</span>
                  </div>
                </div>

                <ul className="mb-8 space-y-3">
                  {tier.features.map((f) => (
                    <li
                      key={f}
                      className="flex items-start gap-3 text-sm text-white/50"
                    >
                      <Check className="mt-0.5 size-4 shrink-0 text-violet-400" />
                      {f}
                    </li>
                  ))}
                </ul>

                <button
                  type="button"
                  className={cn(
                    "w-full cursor-pointer rounded-lg py-2.5 text-sm font-medium transition-all",
                    tier.highlighted
                      ? "bg-gradient-to-r from-violet-600 to-purple-600 text-white hover:from-violet-500 hover:to-purple-500 hover:shadow-[0_0_20px_rgba(124,58,237,0.25)]"
                      : "border border-white/[0.08] text-white/65 hover:bg-white/[0.04] hover:text-white"
                  )}
                >
                  {tier.cta}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ────── FAQ ────── */}
      <section className="relative px-6 py-24 md:py-32">
        <div className="mx-auto max-w-3xl">
          <motion.div
            className="mb-16 text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={stagger}
          >
            <motion.p
              variants={fadeInUp}
              className="mb-3 text-sm font-medium uppercase tracking-widest text-amber-400"
            >
              FAQ
            </motion.p>
            <motion.h2
              variants={fadeInUp}
              className="text-3xl font-bold tracking-tight text-white md:text-4xl lg:text-5xl"
            >
              Frequently Asked Questions
            </motion.h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="rounded-2xl border border-white/[0.05] bg-white/[0.02] px-6 md:px-8"
          >
            {faqs.map((faq) => (
              <FAQItem
                key={faq.question}
                question={faq.question}
                answer={faq.answer}
              />
            ))}
          </motion.div>
        </div>
      </section>

      {/* ────── CTA ────── */}
      <section className="border-t border-white/[0.04] px-6 py-24">
        <motion.div
          className="mx-auto max-w-2xl text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.04] px-4 py-1.5 text-xs text-white/40">
            <Shield className="size-3 text-emerald-400" />
            No credit card required
          </div>
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-white md:text-4xl">
            Ready to download?
          </h2>
          <p className="mx-auto mb-8 max-w-md text-white/40">
            Join 200K+ users who trust ClipVerse for fast, high-quality video
            downloads.
          </p>
          <a
            href="/register"
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-violet-600 to-purple-600 px-8 py-3 text-sm font-semibold text-white transition-all hover:from-violet-500 hover:to-purple-500 hover:shadow-[0_0_30px_rgba(124,58,237,0.3)]"
          >
            Get Started Free
            <ArrowRight className="size-4" />
          </a>
        </motion.div>
      </section>

      {/* ────── FOOTER ────── */}
      <footer className="border-t border-white/[0.04] px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 grid grid-cols-2 gap-10 md:grid-cols-4 md:gap-12">
            <div className="col-span-2 md:col-span-1">
              <span className="bg-gradient-to-r from-violet-400 to-purple-500 bg-clip-text text-xl font-bold tracking-tight text-transparent">
                ClipVerse
              </span>
              <p className="mt-3 max-w-xs text-sm leading-relaxed text-white/30">
                The fastest way to download videos from any platform. Free,
                fast, and beautiful.
              </p>
              <a
                href="https://t.me/clipverse"
                className="mt-4 inline-flex items-center gap-2 text-sm text-white/30 transition-colors hover:text-white/60"
              >
                <Send className="size-4" />
                Telegram
              </a>
            </div>

            <div>
              <h4 className="mb-4 text-sm font-semibold text-white/60">
                Product
              </h4>
              <ul className="space-y-2.5">
                {["Home", "Download", "Pricing", "Chrome Extension"].map(
                  (link) => (
                    <li key={link}>
                      <a
                        href={`/${link.toLowerCase().replace(/\s+/g, "-")}`}
                        className="text-sm text-white/30 transition-colors hover:text-white/60"
                      >
                        {link}
                      </a>
                    </li>
                  )
                )}
              </ul>
            </div>

            <div>
              <h4 className="mb-4 text-sm font-semibold text-white/60">
                Support
              </h4>
              <ul className="space-y-2.5">
                {["FAQ", "Blog", "Contact", "API Docs"].map((link) => (
                  <li key={link}>
                    <a
                      href={`/${link.toLowerCase().replace(/\s+/g, "-")}`}
                      className="text-sm text-white/30 transition-colors hover:text-white/60"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="mb-4 text-sm font-semibold text-white/60">
                Popular
              </h4>
              <ul className="space-y-2.5">
                {[
                  "YouTube 4K Downloader",
                  "TikTok No Watermark",
                  "Instagram Reels Saver",
                  "Bilibili Video Download",
                  "Twitter Video Download",
                ].map((link) => (
                  <li key={link}>
                    <a
                      href={`/${link.toLowerCase().replace(/\s+/g, "-")}`}
                      className="text-sm text-white/30 transition-colors hover:text-white/60"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex flex-col items-center justify-between gap-4 border-t border-white/[0.04] pt-8 md:flex-row">
            <p className="text-xs text-white/20">
              &copy; 2026 ClipVerse. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              {["Privacy", "Terms", "DMCA"].map((link) => (
                <a
                  key={link}
                  href={`/${link.toLowerCase()}`}
                  className="text-xs text-white/20 transition-colors hover:text-white/40"
                >
                  {link}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
