"use client";

import { motion } from "framer-motion";
import { Download, Zap, Keyboard, Globe } from "lucide-react";
import { Navbar } from "@/components/navbar";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

const features = [
  {
    icon: Download,
    title: "One-Click Download",
    description: "Download videos directly from any supported website with a single click",
  },
  {
    icon: Zap,
    title: "Auto-Detect",
    description: "Automatically detects video URLs on any page you visit",
  },
  {
    icon: Keyboard,
    title: "Keyboard Shortcut",
    description: "Use keyboard shortcuts for even faster downloads",
  },
  {
    icon: Globe,
    title: "50+ Sites",
    description: "Works with YouTube, TikTok, Instagram, and 50+ other platforms",
  },
];

export default function ChromeExtensionPage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <Navbar />

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-[20%] h-[500px] w-[600px] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(ellipse,rgba(124,58,237,0.15)_0%,transparent_70%)]" />
        <div className="absolute right-[5%] top-[50%] h-[400px] w-[400px] bg-[radial-gradient(ellipse,rgba(168,85,247,0.1)_0%,transparent_70%)]" />
      </div>

      <main className="relative z-10 mx-auto max-w-4xl px-6 pb-24 pt-32">
        <motion.div
          className="mb-16 text-center"
          initial="hidden"
          animate="visible"
          variants={stagger}
        >
          <motion.h1
            variants={fadeInUp}
            transition={{ duration: 0.5 }}
            className="mb-4 text-4xl font-bold tracking-tight text-white md:text-5xl"
          >
            Download Videos with One Click
          </motion.h1>
          <motion.p
            variants={fadeInUp}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-8 text-lg text-white/40"
          >
            The ClipVerse Chrome extension brings video downloading directly to your browser
          </motion.p>

          <motion.button
            variants={fadeInUp}
            transition={{ duration: 0.5, delay: 0.2 }}
            type="button"
            className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-gradient-to-r from-violet-600 to-purple-600 px-8 py-4 text-base font-semibold text-white transition-all hover:from-violet-500 hover:to-purple-500 hover:shadow-[0_0_32px_rgba(124,58,237,0.4)]"
          >
            <Download className="size-5" />
            Install from Chrome Web Store
          </motion.button>
        </motion.div>

        <motion.div
          className="mb-20 grid gap-6 md:grid-cols-2"
          initial="hidden"
          animate="visible"
          variants={stagger}
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                variants={fadeInUp}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-6 backdrop-blur-sm transition-all hover:border-white/[0.15] hover:bg-white/[0.04]"
              >
                <Icon className="mb-4 size-6 text-violet-400" />
                <h3 className="mb-2 text-lg font-semibold text-white">{feature.title}</h3>
                <p className="text-sm text-white/50">{feature.description}</p>
              </motion.div>
            );
          })}
        </motion.div>

        <motion.section
          className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-8 backdrop-blur-sm"
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <h2 className="mb-6 text-2xl font-bold text-white">How It Works</h2>
          <div className="space-y-4 text-white/50">
            <div className="flex gap-4">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-violet-600/30 text-sm font-semibold text-violet-300">
                1
              </div>
              <div>
                <h3 className="font-semibold text-white/80">Install the Extension</h3>
                <p className="text-sm">Add ClipVerse to your Chrome browser from the Web Store</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-violet-600/30 text-sm font-semibold text-violet-300">
                2
              </div>
              <div>
                <h3 className="font-semibold text-white/80">Visit Any Video Page</h3>
                <p className="text-sm">Go to YouTube, TikTok, Instagram, or any supported platform</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-violet-600/30 text-sm font-semibold text-violet-300">
                3
              </div>
              <div>
                <h3 className="font-semibold text-white/80">Click to Download</h3>
                <p className="text-sm">Click the ClipVerse icon and select your preferred quality</p>
              </div>
            </div>
          </div>
        </motion.section>
      </main>
    </div>
  );
}
