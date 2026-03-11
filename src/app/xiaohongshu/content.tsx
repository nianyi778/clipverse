"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Download,
  ArrowRight,
  Sparkles,
  MonitorPlay,
  Music,
  ListVideo,
  Image,
  Radio,
  ChevronDown,
  Check,
} from "lucide-react";
import { cn, extractUrl } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

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
    icon: Sparkles,
    title: "无水印视频",
    description:
      "自动去除小红书水印，下载干净无遮挡的原始视频。保留原始画质和音频，无任何质量损失。",
  },
  {
    icon: MonitorPlay,
    title: "高清图集",
    description:
      "一键下载小红书图文笔记中的所有高清图片。原始分辨率保存，无压缩、无裁切、无水印。",
  },
  {
    icon: Music,
    title: "音频提取",
    description:
      "从任意小红书视频中提取背景音乐或音频。支持导出为 MP3、AAC、FLAC 等格式，最高 320kbps 音质。",
  },
  {
    icon: ListVideo,
    title: "批量下载",
    description:
      "支持批量下载多个小红书视频和图集。粘贴多个链接即可同时处理，Pro 用户支持最多 10 个内容同时下载。",
  },
  {
    icon: Image,
    title: "笔记保存",
    description:
      "完整保存小红书图文笔记，包括文字描述和所有配图。原始分辨率保存，无压缩、无裁切。",
  },
  {
    icon: Radio,
    title: "直播下载",
    description:
      "下载小红书直播回放录像。直播结束后粘贴链接即可保存完整的直播回放视频内容。",
  },
];

const steps = [
  {
    step: "01",
    title: "粘贴小红书链接",
    description: "复制任意小红书视频、图集或直播回放的分享链接，粘贴到输入框中。",
  },
  {
    step: "02",
    title: "选择画质",
    description: "选择你需要的画质和格式 — 标清、高清、原画，或仅提取音频。",
  },
  {
    step: "03",
    title: "立即下载",
    description: "点击下载按钮，文件将直接保存到你的设备。无需注册、无需安装软件。",
  },
];

interface FAQItem {
  question: string;
  answer: string;
}

const faqItems: FAQItem[] = [
  {
    question: "小红书视频下载支持哪些画质选项？",
    answer:
      "ClipVerse 支持小红书提供的所有画质选项，包括 480p 标清、720p 高清、1080p 全高清，以及创作者上传的原始画质。你还可以选择仅下载音频，支持 MP3 格式最高 320kbps。",
  },
  {
    question: "如何下载小红书图文笔记？",
    answer:
      "粘贴小红书图文笔记的链接，ClipVerse 会自动识别并提供下载所有图片的选项。你可以选择下载单张或全部图片，支持原始分辨率保存。",
  },
  {
    question: "可以下载私密/仅自己可见的笔记吗？",
    answer:
      "不可以。ClipVerse 只能下载公开可见的小红书笔记。设置为私密、好友可见或仅自己可见的内容受到隐私保护，无法被外部工具访问。",
  },
  {
    question: "视频和图集有什么区别？",
    answer:
      "小红书上的笔记分为两种：视频笔记（包含视频内容）和图文笔记（包含多张图片和文字描述）。ClipVerse 支持两种类型的下载，会自动识别并提供相应的下载选项。",
  },
  {
    question: "下载小红书内容合法吗？",
    answer:
      "下载公开内容供个人离线观看通常是可以接受的。但是，未经创作者许可就重新上传、分发或商业使用受版权保护的内容属于侵权行为。请始终尊重创作者的权利和小红书的使用条款。",
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

export default function XiaohongshuContent() {
  const { t } = useI18n();
  const [url, setUrl] = useState("");
  const router = useRouter();

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <Navbar />

      {/* Ambient backgrounds */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-[18%] h-[600px] w-[800px] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(ellipse,rgba(244,63,94,0.1)_0%,transparent_70%)]" />
        <div className="absolute right-0 top-[35%] h-[500px] w-[500px] bg-[radial-gradient(ellipse,rgba(236,72,153,0.07)_0%,transparent_70%)]" />
        <div className="absolute bottom-[15%] left-0 h-[400px] w-[400px] bg-[radial-gradient(ellipse,rgba(239,68,68,0.05)_0%,transparent_70%)]" />
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
            <span className="mb-8 inline-flex items-center gap-2 rounded-full border border-rose-500/20 bg-rose-500/[0.06] px-4 py-1.5 text-xs text-rose-400/80 backdrop-blur-sm">
              <Sparkles className="size-3" />
              小红书视频下载器
            </span>
          </motion.div>

          <motion.h1
            variants={fadeInUp}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-6 text-4xl font-bold leading-[1.08] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl"
          >
            小红书视频下载器 —{" "}
            <span className="bg-gradient-to-r from-rose-400 via-pink-400 to-red-400 bg-clip-text text-transparent">
              无水印高清下载
            </span>
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-white/45 md:text-xl"
          >
            免费下载小红书视频和图集，无水印高清画质。{" "}
            <span className="text-white/65">
              笔记保存、直播下载、音频提取、批量操作 — 全部免费。
            </span>
          </motion.p>

          <motion.div
            variants={fadeInUp}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="relative mx-auto mb-5 max-w-2xl"
          >
            <div className="group relative">
              <div className="absolute -inset-1 animate-glow rounded-2xl bg-gradient-to-r from-rose-600/20 via-pink-600/20 to-red-600/20 blur-xl transition-opacity duration-500 group-hover:opacity-100" />
              <div className="relative flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.04] p-2 backdrop-blur-sm transition-colors duration-300 hover:border-rose-500/20">
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
                  placeholder="在此粘贴小红书视频链接..."
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
                  className="flex shrink-0 cursor-pointer items-center gap-2 rounded-lg bg-gradient-to-r from-rose-600 to-pink-600 px-6 py-3 text-sm font-semibold text-white transition-all hover:from-rose-500 hover:to-pink-500 hover:shadow-[0_0_30px_rgba(244,63,94,0.3)] active:scale-[0.98]"
                >
                  <Download className="size-4" />
                  <span className="hidden sm:inline">下载</span>
                </button>
              </div>
            </div>
          </motion.div>

          <motion.p
            variants={fadeInUp}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="text-sm text-white/25"
          >
            支持 xiaohongshu.com 分享链接
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
              className="mb-3 text-sm font-medium uppercase tracking-widest text-rose-400"
            >
              使用方法
            </motion.p>
            <motion.h2
              variants={fadeInUp}
              className="text-3xl font-bold tracking-tight text-white md:text-4xl lg:text-5xl"
            >
              三步轻松下载
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
              className="mb-3 text-sm font-medium uppercase tracking-widest text-pink-400"
            >
              功能特性
            </motion.p>
            <motion.h2
              variants={fadeInUp}
              className="text-3xl font-bold tracking-tight text-white md:text-4xl lg:text-5xl"
            >
              你需要的一切
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
                  className="group relative cursor-pointer rounded-2xl border border-white/[0.05] bg-white/[0.02] p-8 transition-all duration-500 hover:border-rose-500/20 hover:bg-white/[0.035]"
                >
                  <div className="pointer-events-none absolute -inset-px rounded-2xl bg-gradient-to-b from-rose-500/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  <div className="relative">
                    <div className="mb-5 inline-flex rounded-xl bg-rose-500/10 p-3">
                      <Icon className="size-6 text-rose-400" />
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
              className="mb-3 text-sm font-medium uppercase tracking-widest text-pink-400"
            >
              常见问题
            </motion.p>
            <motion.h2
              variants={fadeInUp}
              className="text-3xl font-bold tracking-tight text-white md:text-4xl"
            >
              小红书下载常见问题
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
            立即开始下载小红书视频
          </h2>
          <p className="mx-auto mb-8 max-w-md text-white/40">
            加入超过 20 万用户的行列，使用 ClipVerse 快速、高质量地下载小红书视频。
          </p>
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <a
              href="/register"
              className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-violet-600 to-purple-600 px-8 py-3 text-sm font-semibold text-white transition-all hover:from-violet-500 hover:to-purple-500 hover:shadow-[0_0_30px_rgba(124,58,237,0.3)]"
            >
              免费开始使用
              <ArrowRight className="size-4" />
            </a>
            <a
              href="/pricing"
              className="inline-flex items-center gap-2 rounded-lg border border-white/[0.08] px-8 py-3 text-sm font-medium text-white/65 transition-all hover:bg-white/[0.04] hover:text-white"
            >
              查看价格
            </a>
          </div>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs text-white/25">
            <span className="flex items-center gap-1.5">
              <Check className="size-3 text-violet-400/60" />
              无需注册
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="size-3 text-violet-400/60" />
              每天 5 次免费下载
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="size-3 text-violet-400/60" />
              免费支持 1080p
            </span>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
