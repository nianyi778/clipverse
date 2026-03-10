"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Download,
  ArrowRight,
  MonitorPlay,
  Film,
  Eye,
  Radio,
  Share2,
  Music,
  ChevronDown,
  Send,
  Check,
} from "lucide-react";
import { cn, extractUrl } from "@/lib/utils";
import { Navbar } from "@/components/navbar";

type IconComponent = typeof Download;

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

interface Feature {
  icon: IconComponent;
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    icon: MonitorPlay,
    title: "HD Video Download",
    description:
      "Download Facebook videos in Full HD 1080p and 4K quality when available. All codecs supported, preserving the original upload quality.",
  },
  {
    icon: Film,
    title: "Facebook Reels",
    description:
      "Save Facebook Reels in their original vertical format. Full quality, no watermarks, no cropping — just the clean content you want.",
  },
  {
    icon: Eye,
    title: "Stories Download",
    description:
      "Download Facebook Stories before they vanish. Save photos and videos from public profiles and pages in their original resolution.",
  },
  {
    icon: Radio,
    title: "Live Replays",
    description:
      "Download Facebook Live replay videos after the broadcast ends. Save entire live streams in high quality for offline viewing anytime.",
  },
  {
    icon: Share2,
    title: "Shared Videos",
    description:
      "Download videos that have been shared across Facebook, including cross-posted content, shared links, and embedded videos from pages.",
  },
  {
    icon: Music,
    title: "Audio Extraction",
    description:
      "Extract audio tracks from any Facebook video. Convert to MP3, AAC, or WAV format with customizable bitrate up to 320kbps.",
  },
];

const steps = [
  {
    step: "01",
    title: "Paste Facebook URL",
    description: "Copy the link of any Facebook video, Reel, Story, or Live replay and paste it in the input field.",
  },
  {
    step: "02",
    title: "Choose Quality",
    description: "Select your preferred quality — SD 480p, HD 720p, Full HD 1080p, or 4K. Pick video or audio-only format.",
  },
  {
    step: "03",
    title: "Download Instantly",
    description: "Click download and save the file to your device. No signup, no software, no waiting.",
  },
];

interface FAQItem {
  question: string;
  answer: string;
}

const faqItems: FAQItem[] = [
  {
    question: "What quality options are available for Facebook downloads?",
    answer:
      "ClipVerse supports all quality tiers that Facebook offers: SD (480p), HD (720p), Full HD (1080p), and 4K (2160p) when the original video was uploaded in that resolution. You can also extract audio-only in MP3 format up to 320kbps.",
  },
  {
    question: "Can I download private Facebook videos?",
    answer:
      "No. ClipVerse can only download videos that are publicly accessible. Content set to 'Friends Only' or 'Only Me' privacy settings cannot be accessed. If the video is visible without logging into Facebook, ClipVerse can download it.",
  },
  {
    question: "How do I download Facebook Reels?",
    answer:
      "Simply copy the Reel link from Facebook (tap Share → Copy Link) and paste it into ClipVerse. The Reel will be downloaded in its original vertical format at the highest available quality without any watermarks.",
  },
  {
    question: "Can I download Facebook Live videos?",
    answer:
      "Yes, but only after the live broadcast has ended and the replay is available. Paste the Live video replay URL into ClipVerse and download it just like any other Facebook video. Live streams in progress cannot be downloaded.",
  },
  {
    question: "Can I download videos from Facebook Groups?",
    answer:
      "ClipVerse can download videos from public Facebook Groups. If the group is set to public and the video is accessible without membership, it can be downloaded. Private and closed group content requires membership and cannot be accessed by ClipVerse.",
  },
];

function FAQAccordion({ item, index }: { item: FAQItem; index: number }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.8 + index * 0.06 }}
      className="border-b border-white/[0.06] last:border-b-0"
    >
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full cursor-pointer items-center justify-between py-5 text-left"
      >
        <span className="pr-4 text-sm font-medium text-white/80 sm:text-base">
          {item.question}
        </span>
        <ChevronDown
          className={cn(
            "size-4 shrink-0 text-white/30 transition-transform duration-200",
            open && "rotate-180"
          )}
        />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-sm leading-relaxed text-white/40">
              {item.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function FacebookContent() {
  const [url, setUrl] = useState("");
  const router = useRouter();

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <Navbar />

      {/* Ambient backgrounds */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-[18%] h-[600px] w-[800px] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(ellipse,rgba(59,130,246,0.1)_0%,transparent_70%)]" />
        <div className="absolute right-0 top-[35%] h-[500px] w-[500px] bg-[radial-gradient(ellipse,rgba(99,102,241,0.07)_0%,transparent_70%)]" />
        <div className="absolute bottom-[15%] left-0 h-[400px] w-[400px] bg-[radial-gradient(ellipse,rgba(37,99,235,0.05)_0%,transparent_70%)]" />
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage:
              "radial-gradient(rgba(255,255,255,0.7) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      {/* Hero */}
      <section className="relative px-6 pt-32 pb-20 md:pt-40 md:pb-24">
        <motion.div
          className="relative z-10 mx-auto max-w-4xl text-center"
          initial="hidden"
          animate="visible"
          variants={stagger}
        >
          <motion.div variants={fadeInUp} transition={{ duration: 0.5 }}>
            <span className="mb-8 inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/[0.06] px-4 py-1.5 text-xs text-blue-400/80 backdrop-blur-sm">
              <MonitorPlay className="size-3" />
              Facebook Video Downloader
            </span>
          </motion.div>

          <motion.h1
            variants={fadeInUp}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-6 text-4xl font-bold leading-[1.08] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl"
          >
            Facebook Video Downloader —{" "}
            <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-blue-500 bg-clip-text text-transparent">
              Free HD
            </span>
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-white/45 md:text-xl"
          >
            Download Facebook videos in HD and 4K quality.{" "}
            <span className="text-white/65">
              Reels, Stories, Live replays, shared videos — all free.
            </span>
          </motion.p>

          <motion.div
            variants={fadeInUp}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="relative mx-auto mb-5 max-w-2xl"
          >
            <div className="group relative">
              <div className="absolute -inset-1 animate-glow rounded-2xl bg-gradient-to-r from-blue-600/20 via-indigo-600/20 to-blue-600/20 blur-xl transition-opacity duration-500 group-hover:opacity-100" />
              <div className="relative flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.04] p-2 backdrop-blur-sm transition-colors duration-300 hover:border-blue-500/20">
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" &&
                    url.trim() &&
                    router.push(
                      `/download?url=${encodeURIComponent(extractUrl(url))}`
                    )
                  }
                  placeholder="Paste Facebook video link here..."
                  className="min-w-0 flex-1 bg-transparent px-4 py-3 text-base text-white outline-none placeholder:text-white/25"
                />
                <button
                  type="button"
                  onClick={() =>
                    url.trim() &&
                    router.push(
                      `/download?url=${encodeURIComponent(extractUrl(url))}`
                    )
                  }
                  className="flex shrink-0 cursor-pointer items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 text-sm font-semibold text-white transition-all hover:from-blue-500 hover:to-indigo-500 hover:shadow-[0_0_30px_rgba(59,130,246,0.3)] active:scale-[0.98]"
                >
                  <Download className="size-4" />
                  <span className="hidden sm:inline">Download</span>
                </button>
              </div>
            </div>
          </motion.div>

          <motion.p
            variants={fadeInUp}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="text-sm text-white/25"
          >
            Supports facebook.com, fb.watch, and fb.gg video links
          </motion.p>
        </motion.div>
      </section>

      {/* How it works */}
      <section className="relative border-y border-white/[0.04] px-6 py-24 md:py-32">
        <div className="mx-auto max-w-5xl">
          <motion.div
            className="mb-16 text-center"
            initial="hidden"
            animate="visible"
            variants={stagger}
          >
            <motion.p
              variants={fadeInUp}
              className="mb-3 text-sm font-medium uppercase tracking-widest text-blue-400"
            >
              How It Works
            </motion.p>
            <motion.h2
              variants={fadeInUp}
              className="text-3xl font-bold tracking-tight text-white md:text-4xl lg:text-5xl"
            >
              Three Simple Steps
            </motion.h2>
          </motion.div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {steps.map((s, i) => (
              <motion.div
                key={s.step}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 + i * 0.1 }}
                className="relative rounded-2xl border border-white/[0.05] bg-white/[0.02] p-8"
              >
                <span className="mb-4 block text-4xl font-bold text-white/[0.06]">
                  {s.step}
                </span>
                <h3 className="mb-2 text-lg font-semibold text-white/90">
                  {s.title}
                </h3>
                <p className="text-sm leading-relaxed text-white/40">
                  {s.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="relative px-6 py-24 md:py-32">
        <div className="mx-auto max-w-6xl">
          <motion.div
            className="mb-16 text-center"
            initial="hidden"
            animate="visible"
            variants={stagger}
          >
            <motion.p
              variants={fadeInUp}
              className="mb-3 text-sm font-medium uppercase tracking-widest text-indigo-400"
            >
              Features
            </motion.p>
            <motion.h2
              variants={fadeInUp}
              className="text-3xl font-bold tracking-tight text-white md:text-4xl lg:text-5xl"
            >
              Everything You Need
            </motion.h2>
          </motion.div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 md:gap-5">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 + i * 0.07 }}
                  className="group relative cursor-pointer rounded-2xl border border-white/[0.05] bg-white/[0.02] p-8 transition-all duration-500 hover:border-blue-500/20 hover:bg-white/[0.035]"
                >
                  <div className="pointer-events-none absolute -inset-px rounded-2xl bg-gradient-to-b from-blue-500/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  <div className="relative">
                    <div className="mb-5 inline-flex rounded-xl bg-blue-500/10 p-3">
                      <Icon className="size-6 text-blue-400" />
                    </div>
                    <h3 className="mb-2 text-lg font-semibold text-white/90">
                      {feature.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-white/40">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-6 py-24 md:py-32">
        <div className="mx-auto max-w-3xl">
          <motion.div
            className="mb-12 text-center"
            initial="hidden"
            animate="visible"
            variants={stagger}
          >
            <motion.p
              variants={fadeInUp}
              className="mb-3 text-sm font-medium uppercase tracking-widest text-indigo-400"
            >
              FAQ
            </motion.p>
            <motion.h2
              variants={fadeInUp}
              className="text-3xl font-bold tracking-tight text-white md:text-4xl"
            >
              Facebook Download Questions
            </motion.h2>
          </motion.div>

          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] px-6">
            {faqItems.map((item, i) => (
              <FAQAccordion key={item.question} item={item} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-white/[0.04] px-6 py-24">
        <motion.div
          className="mx-auto max-w-2xl text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-white md:text-4xl">
            Start downloading Facebook videos
          </h2>
          <p className="mx-auto mb-8 max-w-md text-white/40">
            Join 200K+ users who trust ClipVerse for fast, high-quality Facebook
            video downloads.
          </p>
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <a
              href="/register"
              className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-violet-600 to-purple-600 px-8 py-3 text-sm font-semibold text-white transition-all hover:from-violet-500 hover:to-purple-500 hover:shadow-[0_0_30px_rgba(124,58,237,0.3)]"
            >
              Get Started Free
              <ArrowRight className="size-4" />
            </a>
            <a
              href="/pricing"
              className="inline-flex items-center gap-2 rounded-lg border border-white/[0.08] px-8 py-3 text-sm font-medium text-white/65 transition-all hover:bg-white/[0.04] hover:text-white"
            >
              View Pricing
            </a>
          </div>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs text-white/25">
            <span className="flex items-center gap-1.5">
              <Check className="size-3 text-violet-400/60" />
              No signup required
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="size-3 text-violet-400/60" />
              5 free downloads/day
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="size-3 text-violet-400/60" />
              Up to 1080p free
            </span>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
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
                  { label: "YouTube 4K Downloader", href: "/youtube" },
                  { label: "TikTok No Watermark", href: "/tiktok" },
                  { label: "Instagram Reels Saver", href: "/instagram" },
                  { label: "Bilibili Video Download", href: "/bilibili" },
                  { label: "Twitter Video Download", href: "/twitter" },
                ].map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-white/30 transition-colors hover:text-white/60"
                    >
                      {link.label}
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
