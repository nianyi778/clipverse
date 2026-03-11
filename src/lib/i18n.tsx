"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Locale = "en" | "zh-CN" | "ja" | "ko";

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
}

const translations: Record<Locale, Record<string, string>> = {
  en: {
    "home.title": "Download Videos from Any Platform, Instantly",
    "home.subtitle": "Paste a link. Pick quality. Download. No software needed.",
    "home.cta": "Try it free — 5 downloads/day, 1080p quality",
    "home.input": "Paste video link here... (YouTube, TikTok, Instagram...)",
    "home.download": "Download",
    "features.title": "Why ClipVerse?",
    "features.4k.title": "4K Ultra HD",
    "features.4k.desc": "YouTube 4K, Bilibili 4K+VIP, multiple codecs (AV1 / VP9 / H.264).",
    "features.batch.title": "Batch Download",
    "features.batch.desc": "Download up to 10 videos at once with queue management.",
    "features.extension.title": "Chrome Extension",
    "features.extension.desc": "One-click download button on any video page.",
    "features.subtitles.title": "AI Subtitles",
    "features.subtitles.desc": "Auto-extract subtitles with AI translation in 50+ languages.",
    "pricing.title": "Simple, Transparent Pricing",
    "pricing.free.name": "Free",
    "pricing.free.price": "$0",
    "pricing.free.period": "forever",
    "pricing.pro.name": "Pro",
    "pricing.pro.price": "$3.99",
    "pricing.pro.period": "/month",
    "pricing.lifetime.name": "Lifetime",
    "pricing.lifetime.price": "$29.99",
    "nav.home": "Home",
    "nav.download": "Download",
    "nav.tools": "Tools",
    "nav.pricing": "Pricing",
    "nav.login": "Log in",
    "nav.register": "Get Started",
    "download.title": "Download Video",
    "download.subtitle": "Paste a video URL to analyze and download in your preferred quality",
    "download.placeholder": "Paste video URL here...",
    "download.parse": "Parse",
    "download.parsing": "Analyzing...",
    "download.tryAgain": "Try again",
    "download.parseAnother": "Parse another URL",
    "download.recent": "Recent Downloads",
    "download.noDownloads": "No downloads yet",
    "supported": "Supported: YouTube, TikTok, Instagram, Twitter/X, Bilibili, 小红书, 抖音, Facebook, Vimeo",
    "video.selectQuality": "Select Quality",
    "video.download": "Download",
    "video.downloading": "Downloading...",
    "video.audioOnly": "Audio Only",
  },
  "zh-CN": {
    "home.title": "从任意平台即时下载视频",
    "home.subtitle": "粘贴链接 → 选择画质 → 下载。无需安装软件。",
    "home.cta": "免费试用 — 每天5次下载，1080p画质",
    "home.input": "在此粘贴视频链接... (YouTube, TikTok, Instagram...)",
    "home.download": "下载",
    "features.title": "为什么选择 ClipVerse？",
    "features.4k.title": "4K 超高清",
    "features.4k.desc": "YouTube 4K、B站 4K+VIP，支持多种编码。",
    "features.batch.title": "批量下载",
    "features.batch.desc": "一次最多下载10个视频，支持队列管理。",
    "features.extension.title": "Chrome 扩展",
    "features.extension.desc": "在任何视频页面一键下载。",
    "features.subtitles.title": "AI 字幕",
    "features.subtitles.desc": "自动提取字幕，支持AI翻译。",
    "pricing.title": "简单透明的定价",
    "pricing.free.name": "免费",
    "pricing.free.price": "$0",
    "pricing.free.period": "永久",
    "pricing.pro.name": "专业版",
    "pricing.pro.price": "$3.99",
    "pricing.pro.period": "/月",
    "pricing.lifetime.name": "终身版",
    "pricing.lifetime.price": "$29.99",
    "nav.home": "首页",
    "nav.download": "下载",
    "nav.tools": "工具",
    "nav.pricing": "价格",
    "nav.login": "登录",
    "nav.register": "免费开始",
    "download.title": "下载视频",
    "download.subtitle": "粘贴视频链接，分析并下载您想要的画质",
    "download.placeholder": "在此粘贴视频链接...",
    "download.parse": "解析",
    "download.parsing": "正在分析...",
    "download.tryAgain": "重试",
    "download.parseAnother": "解析其他链接",
    "download.recent": "最近下载",
    "download.noDownloads": "暂无下载记录",
    "supported": "支持：YouTube、TikTok、Instagram、Twitter/X、B站、小红书、抖音、Facebook、Vimeo",
    "video.selectQuality": "选择画质",
    "video.download": "下载",
    "video.downloading": "下载中...",
    "video.audioOnly": "仅音频",
  },
  ja: {
    "home.title": "あらゆるプラットフォームから動画を即座にダウンロード",
    "home.subtitle": "リンクを貼り付けて画質を選んでダウンロード。ソフト不要。",
    "home.cta": "無料試用 — 1日5回ダウンロード、1080p画質",
    "home.input": "動画リンクをここに貼り付け... (YouTube, TikTok, Instagram...)",
    "home.download": "ダウンロード",
    "features.title": "ClipVerseが選ばれる理由",
    "features.4k.title": "4K ウルトラHD",
    "features.4k.desc": "YouTube 4K、Bilibili 4K+VIP対応。",
    "features.batch.title": "一括ダウンロード",
    "features.batch.desc": "一度に最大10本の動画をダウンロード。",
    "features.extension.title": "Chrome拡張",
    "features.extension.desc": "どの動画ページでもワクリックでダウンロード。",
    "features.subtitles.title": "AI字幕",
    "features.subtitles.desc": "自動字幕抽出、AI翻訳対応。",
    "pricing.title": "シンプルな料金設定",
    "pricing.free.name": "無料",
    "pricing.free.price": "$0",
    "pricing.free.period": "永久",
    "pricing.pro.name": "プロ",
    "pricing.pro.price": "$3.99",
    "pricing.pro.period": "/月",
    "pricing.lifetime.name": "ライフタイム",
    "pricing.lifetime.price": "$29.99",
    "nav.home": "ホーム",
    "nav.download": "ダウンロード",
    "nav.tools": "ツール",
    "nav.pricing": "料金",
    "nav.login": "ログイン",
    "nav.register": "無料で始める",
    "download.title": "動画をダウンロード",
    "download.subtitle": "動画URLを貼り付けて分析、好みの画質でダウンロード",
    "download.placeholder": "動画URLをここに貼り付け...",
    "download.parse": "解析",
    "download.parsing": "解析中...",
    "download.tryAgain": "再試行",
    "download.parseAnother": "他のURLを解析",
    "download.recent": "最近のダウンロード",
    "download.noDownloads": "ダウンロード履歴なし",
    "supported": "対応：YouTube、TikTok、Instagram、Twitter/X、B站、小紅書、抖音、Facebook、Vimeo",
    "video.selectQuality": "画質を選択",
    "video.download": "ダウンロード",
    "video.downloading": "ダウンロード中...",
    "video.audioOnly": "音声のみ",
  },
  ko: {
    "home.title": "어떤 플랫폼에서든 즉시 비디오 다운로드",
    "home.subtitle": "링크를 붙여넣고 화질을 선택하고 다운로드.",
    "home.cta": "무료 체험 — 하루 5회 다운로드, 1080p 화질",
    "home.input": "비디오 링크를 여기에 붙여넣기... (YouTube, TikTok, Instagram...)",
    "home.download": "다운로드",
    "features.title": "ClipVerse가 좋은 이유",
    "features.4k.title": "4K 울트라 HD",
    "features.4k.desc": "YouTube 4K, Bilibili 4K+VIP 지원.",
    "features.batch.title": "일괄 다운로드",
    "features.batch.desc": "한 번에 최대 10개 비디오 다운로드.",
    "features.extension.title": "Chrome 확장",
    "features.extension.desc": "모든 비디오 페이지에서 원클릭 다운로드.",
    "features.subtitles.title": "AI 자막",
    "features.subtitles.desc": "자동 자막 추출, AI 번역 지원.",
    "pricing.title": "간단한 가격 정책",
    "pricing.free.name": "무료",
    "pricing.free.price": "$0",
    "pricing.free.period": "영구",
    "pricing.pro.name": "프로",
    "pricing.pro.price": "$3.99",
    "pricing.pro.period": "/월",
    "pricing.lifetime.name": "평생",
    "pricing.lifetime.price": "$29.99",
    "nav.home": "홈",
    "nav.download": "다운로드",
    "nav.tools": "도구",
    "nav.pricing": "가격",
    "nav.login": "로그인",
    "nav.register": "무료 시작",
    "download.title": "비디오 다운로드",
    "download.subtitle": "비디오 URL을 붙여넣고 분석한 후 원하는 화질로 다운로드",
    "download.placeholder": "비디오 URL을 여기에 붙여넣기...",
    "download.parse": "분석",
    "download.parsing": "분석 중...",
    "download.tryAgain": "다시 시도",
    "download.parseAnother": "다른 URL 분석",
    "download.recent": "최근 다운로드",
    "download.noDownloads": "다운로드 기록 없음",
    "supported": "지원: YouTube, TikTok, Instagram, Twitter/X, Bilibili, 샤오홍슈, 두인, Facebook, Vimeo",
    "video.selectQuality": "화질 선택",
    "video.download": "다운로드",
    "video.downloading": "다운로드 중...",
    "video.audioOnly": "오디오만",
  },
};

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>("en");

  useEffect(() => {
    const saved = localStorage.getItem("locale") as Locale;
    if (saved && translations[saved]) {
      setLocale(saved);
    }
  }, []);

  const handleSetLocale = (newLocale: Locale) => {
    setLocale(newLocale);
    localStorage.setItem("locale", newLocale);
  };

  const t = (key: string): string => {
    return translations[locale][key] || translations.en[key] || key;
  };

  return (
    <I18nContext.Provider value={{ locale, setLocale: handleSetLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within I18nProvider");
  }
  return context;
}

export type { Locale };
