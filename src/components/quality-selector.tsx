"use client";

import { Download, Crown, VolumeX, Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { VideoFormat, AudioFormat } from "@/types/video";
import { useI18n } from "@/lib/i18n";

interface QualitySelectorProps {
  formats: VideoFormat[] | AudioFormat[];
  onSelect: (formatId: string) => void;
  selectedId?: string;
  onDownload?: (formatId: string) => void;
  downloading?: boolean;
}

function isVideoFormat(
  format: VideoFormat | AudioFormat
): format is VideoFormat {
  return "hasAudio" in format;
}

export function QualitySelector({
  formats,
  onSelect,
  selectedId,
  onDownload,
  downloading,
}: QualitySelectorProps) {
  const { t } = useI18n();
  if (formats.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-white/30">
        No formats available
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {formats.map((format) => {
          const selected = format.formatId === selectedId;
          const video = isVideoFormat(format);
          const isPro = format.quality === "4K" || format.quality === "2K";

          return (
            <button
              key={format.formatId}
              type="button"
              onClick={() => onSelect(format.formatId)}
              className={cn(
                "group relative flex cursor-pointer flex-col rounded-xl border p-3.5 text-left transition-all duration-200 active:scale-[0.97]",
                selected
                  ? "border-violet-500/40 bg-violet-500/[0.08] shadow-[0_0_20px_rgba(124,58,237,0.1)]"
                  : "border-white/[0.06] bg-white/[0.025] hover:border-white/[0.12] hover:bg-white/[0.04]"
              )}
            >
              <div
                className={cn(
                  "absolute right-3 top-3 flex size-5 items-center justify-center rounded-full border transition-all",
                  selected
                    ? "border-violet-500 bg-violet-500"
                    : "border-white/15"
                )}
              >
                {selected && <Check className="size-3 text-white" />}
              </div>

              <div className="mb-1.5 flex items-center gap-2">
                <span className="text-lg font-bold text-white">
                  {format.quality}
                </span>
                {isPro && (
                  <span className="flex items-center gap-0.5 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 px-1.5 py-0.5 text-[10px] font-semibold tracking-wide text-amber-400">
                    <Crown className="size-2.5" />
                    PRO
                  </span>
                )}
                {video && format.fps && (
                  <span className="rounded bg-white/[0.06] px-1.5 py-0.5 text-[10px] text-white/35">
                    {format.fps}fps
                  </span>
                )}
              </div>

              <p className="text-xs text-white/40">
                {format.codec}
                <span className="text-white/20"> · </span>.{format.container}
              </p>

              <div className="mt-2 flex items-center gap-2.5">
                {format.fileSize && (
                  <span className="text-[11px] font-medium text-white/25">
                    {format.fileSize}
                  </span>
                )}
                {video && !format.hasAudio && (
                  <span className="flex items-center gap-0.5 text-[10px] text-amber-400/60">
                    <VolumeX className="size-2.5" />
                    Video only
                  </span>
                )}
                {video && format.hasAudio && (
                  <span className="text-[10px] text-emerald-400/50">
                    Includes audio
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      <button
        type="button"
        disabled={!selectedId || downloading}
        onClick={() => {
          if (selectedId && onDownload) onDownload(selectedId);
        }}
        className={cn(
          "flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-semibold transition-all duration-200",
          !selectedId || downloading
            ? "cursor-not-allowed bg-white/[0.03] text-white/20"
            : "cursor-pointer bg-gradient-to-r from-violet-600 to-purple-600 text-white hover:from-violet-500 hover:to-purple-500 hover:shadow-[0_0_30px_rgba(124,58,237,0.3)] active:scale-[0.98]"
        )}
      >
        {downloading ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            {t("video.downloading")}
          </>
        ) : (
          <>
            <Download className="size-4" />
            {selectedId ? t("video.download") : t("video.selectQuality")}
          </>
        )}
      </button>
    </div>
  );
}
