"use client";

import { useState } from "react";
import {
  Play,
  Download,
  MonitorPlay,
  Music,
  Subtitles,
  User,
  Eye,
  Calendar,
  Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import type { ParsedVideo, Platform } from "@/types/video";
import { QualitySelector } from "./quality-selector";

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0)
    return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return `${m}:${String(s).padStart(2, "0")}`;
}

function formatViewCount(count: number): string {
  if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M`;
  if (count >= 1_000) return `${(count / 1_000).toFixed(1)}K`;
  return count.toString();
}

const platformConfig: Record<Platform, { label: string; className: string }> = {
  youtube: { label: "YouTube", className: "text-red-400 bg-red-500/10" },
  tiktok: { label: "TikTok", className: "text-cyan-300 bg-cyan-500/10" },
  instagram: { label: "Instagram", className: "text-pink-400 bg-pink-500/10" },
  twitter: { label: "Twitter / X", className: "text-sky-400 bg-sky-500/10" },
  bilibili: { label: "Bilibili", className: "text-blue-400 bg-blue-500/10" },
  xiaohongshu: { label: "\u5c0f\u7ea2\u4e66", className: "text-rose-400 bg-rose-500/10" },
  douyin: { label: "\u6296\u97f3", className: "text-teal-300 bg-teal-500/10" },
  facebook: { label: "Facebook", className: "text-blue-400 bg-blue-500/10" },
  threads: { label: "Threads", className: "text-neutral-300 bg-neutral-500/10" },
  pinterest: { label: "Pinterest", className: "text-red-400 bg-red-500/10" },
  vimeo: { label: "Vimeo", className: "text-sky-300 bg-sky-500/10" },
  other: { label: "Other", className: "text-gray-400 bg-gray-500/10" },
};

type TabId = "video" | "audio" | "subtitles";

const tabs: { id: TabId; label: string; icon: typeof MonitorPlay }[] = [
  { id: "video", label: "Video", icon: MonitorPlay },
  { id: "audio", label: "Audio", icon: Music },
  { id: "subtitles", label: "Subtitles", icon: Subtitles },
];

export function VideoResultCard({ video }: { video: ParsedVideo }) {
  const [activeTab, setActiveTab] = useState<TabId>("video");
  const [selectedVideoId, setSelectedVideoId] = useState<string | undefined>(
    video.videoFormats[0]?.formatId
  );
  const [selectedAudioId, setSelectedAudioId] = useState<string | undefined>(
    video.audioFormats[0]?.formatId
  );
  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState("");
  const [downloadingSubtitle, setDownloadingSubtitle] = useState<string | null>(null);

  const platform = platformConfig[video.platform];

  const handleDownload = async (formatId: string, type: "video" | "audio") => {
    try {
      setDownloading(true);
      setDownloadError("");

      const body: Record<string, string> = {
        url: video.url,
        formatId,
        type,
      };

      // If video format has no audio, attach the first audio format
      if (type === "video") {
        const selectedVideoFormat = video.videoFormats.find(
          (f) => f.formatId === formatId
        );
        if (selectedVideoFormat && !selectedVideoFormat.hasAudio && video.audioFormats.length > 0) {
          body.audioFormatId = video.audioFormats[0].formatId;
        }
      }

      const res = await fetch("/api/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Download failed");

      const proxyBase = process.env.NEXT_PUBLIC_YTDLP_PROXY_URL || "http://localhost:8787";
      const filename = data.filename || `${video.title || "download"}.mp4`;
      
      // Use /proxy with direct CDN URL for platforms that need signing (Douyin, etc.)
      // Fall back to /stream for platforms that work with re-fetching
      if (data.downloadUrl) {
        const params = new URLSearchParams({
          url: data.downloadUrl,
          filename,
        });
        window.location.href = `${proxyBase}/proxy?${params.toString()}`;
      } else {
        const params = new URLSearchParams({
          url: video.url,
          formatId,
          filename,
        });
        if (body.audioFormatId) params.set("audioFormatId", body.audioFormatId);
        window.location.href = `${proxyBase}/stream?${params.toString()}`;
      }
    } catch (err) {
      setDownloadError(err instanceof Error ? err.message : "Download failed");
    } finally {
      setDownloading(false);
    }
  };

  const handleSubtitleDownload = async (languageCode: string, language: string) => {
    try {
      setDownloadingSubtitle(languageCode);
      setDownloadError("");

      const res = await fetch("/api/subtitles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: video.url, languageCode }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Failed to download subtitles");

      if (data.data && data.data.length > 0) {
        const sub = data.data[0];
        const blob = new Blob([sub.content], { type: "text/plain;charset=utf-8" });
        const blobUrl = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = blobUrl;
        a.download = `${video.title || "subtitle"}_${language}.${sub.format || "srt"}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(blobUrl);
      }
    } catch (err) {
      setDownloadError(err instanceof Error ? err.message : "Failed to download subtitles");
    } finally {
      setDownloadingSubtitle(null);
    }
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm">
      <div className="flex flex-col gap-5 p-5 md:flex-row">
        <div className="relative flex aspect-video shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-white/[0.05] to-white/[0.01] md:w-72">
          {video.thumbnail ? (
            <img
              src={video.thumbnail}
              alt={video.title || "Video thumbnail"}
              className="absolute inset-0 h-full w-full object-cover"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div
              className="absolute inset-0 opacity-[0.04]"
              style={{
                backgroundImage:
                  "radial-gradient(rgba(255,255,255,0.6) 1px, transparent 1px)",
                backgroundSize: "16px 16px",
              }}
            />
          )}
          <a
            href={video.url}
            target="_blank"
            rel="noopener noreferrer"
            className="relative flex size-12 items-center justify-center rounded-full bg-black/40 backdrop-blur-sm transition-transform hover:scale-110 hover:bg-black/60"
          >
            <Play className="ml-0.5 size-5 fill-white text-white" />
          </a>
          {video.duration !== undefined && (
            <span className="absolute bottom-2.5 right-2.5 rounded-md bg-black/70 px-2 py-0.5 font-mono text-xs font-medium text-white/90 backdrop-blur-sm">
              {formatDuration(video.duration)}
            </span>
          )}
        </div>

        <div className="flex min-w-0 flex-1 flex-col justify-center">
          <span
            className={cn(
              "mb-2 inline-flex w-fit items-center rounded-full px-2 py-0.5 text-[11px] font-medium",
              platform.className
            )}
          >
            {platform.label}
          </span>

          <h2 className="mb-2 line-clamp-2 text-lg font-semibold leading-snug text-white/90">
            {video.title}
          </h2>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-white/35">
            {video.author && (
              <span className="flex items-center gap-1">
                <User className="size-3" />
                {video.author}
              </span>
            )}
            {video.viewCount !== undefined && (
              <span className="flex items-center gap-1">
                <Eye className="size-3" />
                {formatViewCount(video.viewCount)} views
              </span>
            )}
            {video.uploadDate && (
              <span className="flex items-center gap-1">
                <Calendar className="size-3" />
                {video.uploadDate}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="border-t border-white/[0.06] px-5 pb-5 pt-4">
        <div className="mb-4 flex gap-1 rounded-lg bg-white/[0.03] p-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "relative flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-md px-3 py-2 text-xs font-medium transition-all duration-200",
                  active ? "text-white" : "text-white/35 hover:text-white/55"
                )}
              >
                {active && (
                  <motion.div
                    layoutId="active-tab"
                    className="absolute inset-0 rounded-md bg-white/[0.07]"
                    transition={{
                      type: "spring",
                      duration: 0.35,
                      bounce: 0.15,
                    }}
                  />
                )}
                <Icon className="relative z-10 size-3.5" />
                <span className="relative z-10">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {downloadError && (
          <p className="mb-3 text-center text-xs text-red-400">{downloadError}</p>
        )}

        <AnimatePresence mode="wait">
          {activeTab === "video" && (
            <motion.div
              key="video"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <QualitySelector
                formats={video.videoFormats}
                onSelect={setSelectedVideoId}
                selectedId={selectedVideoId}
                onDownload={(formatId) => handleDownload(formatId, "video")}
                downloading={downloading}
              />
            </motion.div>
          )}

          {activeTab === "audio" && (
            <motion.div
              key="audio"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <QualitySelector
                formats={video.audioFormats}
                onSelect={setSelectedAudioId}
                selectedId={selectedAudioId}
                onDownload={(formatId) => handleDownload(formatId, "audio")}
                downloading={downloading}
              />
            </motion.div>
          )}

          {activeTab === "subtitles" && (
            <motion.div
              key="subtitles"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              {video.subtitles && video.subtitles.length > 0 ? (
                <div className="space-y-2">
                  {video.subtitles.map((sub) => (
                    <div
                      key={sub.languageCode}
                      className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-white/80">
                          {sub.language}
                        </span>
                        <span className="rounded bg-white/[0.06] px-1.5 py-0.5 text-[10px] uppercase text-white/30">
                          {sub.format}
                        </span>
                      </div>
                      <button
                        type="button"
                        disabled={downloadingSubtitle === sub.languageCode}
                        onClick={() => handleSubtitleDownload(sub.languageCode, sub.language)}
                        className="flex cursor-pointer items-center gap-1 text-xs text-violet-400 transition-colors hover:text-violet-300 disabled:cursor-wait disabled:opacity-50"
                      >
                        {downloadingSubtitle === sub.languageCode ? (
                          <Loader2 className="size-3 animate-spin" />
                        ) : (
                          <Download className="size-3" />
                        )}
                        Download
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="py-8 text-center text-sm text-white/30">
                  No subtitles available
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
