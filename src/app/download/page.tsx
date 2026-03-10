"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Loader2, AlertCircle, RotateCcw, Clock, CheckCircle, XCircle, ExternalLink, Globe, Youtube } from "lucide-react";
import { cn } from "@/lib/utils";
import { Navbar } from "@/components/navbar";
import { VideoResultCard } from "@/components/video-result-card";
import type { ParsedVideo, ParseState } from "@/types/video";

interface DownloadRecord {
  id: string;
  url: string;
  platform: string;
  title: string | null;
  quality: string | null;
  status: string;
  createdAt: string;
}

function timeAgo(date: string) {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function PlatformIcon({ platform }: { platform: string }) {
  if (platform.toLowerCase() === "youtube") return <Youtube className="size-3.5 text-red-400" />;
  return <Globe className="size-3.5 text-white/30" />;
}

const STATUS_ICON: Record<string, React.ReactNode> = {
  completed: <CheckCircle className="size-3.5 text-emerald-400" />,
  failed: <XCircle className="size-3.5 text-red-400" />,
  processing: <Loader2 className="size-3.5 animate-spin text-violet-400" />,
  pending: <Clock className="size-3.5 text-white/30" />,
};

const supportedPlatforms = [
  "YouTube",
  "TikTok",
  "Instagram",
  "Twitter / X",
  "Bilibili",
  "\u5c0f\u7ea2\u4e66",
  "\u6296\u97f3",
  "Facebook",
  "Vimeo",
];

function extractUrl(input: string): string {
  const trimmed = input.trim();
  try { new URL(trimmed); return trimmed; } catch {}
  const match = trimmed.match(/https?:\/\/[^\s\u3000-\u9fff\uff00-\uffef\u{1F000}-\u{1FFFF}]+/u);
  if (match) return match[0].replace(/[^\w\-._~:/?#[\]@!$&'()*+,;=%]+$/, "");
  return trimmed;
}

function DownloadPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { status: authStatus } = useSession();
  const [url, setUrl] = useState("");
  const [parseState, setParseState] = useState<ParseState>("idle");
  const [parsedVideo, setParsedVideo] = useState<ParsedVideo | null>(null);
  const [error, setError] = useState("");
  const [recentDownloads, setRecentDownloads] = useState<DownloadRecord[]>([]);
  const [loadingRecent, setLoadingRecent] = useState(false);

  const handleParse = async (targetUrl?: string) => {
    const raw = targetUrl || url;
    if (!raw.trim()) {
      setError("Please enter a video URL");
      setParseState("error");
      return;
    }
    const parseUrl = extractUrl(raw);
    setUrl(parseUrl);
    hasAutoParseRef.current = true;
    try {
      setParseState("parsing");
      setError("");
      const res = await fetch("/api/parse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: parseUrl }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Failed to parse video");
      setParsedVideo(data.data);
      setParseState("success");
      const newParams = new URLSearchParams(searchParams.toString());
      newParams.set("url", parseUrl);
      router.replace(`/download?${newParams.toString()}`, { scroll: false });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to parse video");
      setParseState("error");
    }
  };

  useEffect(() => {
    if (authStatus !== "authenticated") return;
    setLoadingRecent(true);
    fetch("/api/user/downloads")
      .then((r) => r.json())
      .then((d) => { if (d.success) setRecentDownloads(d.downloads.slice(0, 10)); })
      .catch(() => {})
      .finally(() => setLoadingRecent(false));
  }, [authStatus]);

  const hasAutoParseRef = useRef(false);

  useEffect(() => {
    const urlParam = searchParams.get("url");
    if (urlParam && !hasAutoParseRef.current) {
      hasAutoParseRef.current = true;
      const cleanUrl = extractUrl(urlParam);
      setUrl((prev) => prev || cleanUrl);
      (async () => {
        try {
          setParseState("parsing");
          setError("");
          const res = await fetch("/api/parse", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url: cleanUrl }),
          });
          const data = await res.json();
          if (!data.success) throw new Error(data.error || "Failed to parse video");
          setParsedVideo(data.data);
          setParseState("success");
        } catch (err) {
          setError(err instanceof Error ? err.message : "Failed to parse video");
          setParseState("error");
        }
      })();
    }
  }, [searchParams]);

  const handleReset = () => {
    setUrl("");
    setParsedVideo(null);
    setParseState("idle");
    setError("");
    hasAutoParseRef.current = false;
    router.replace("/download", { scroll: false });
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <Navbar />

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-[15%] h-[500px] w-[700px] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(ellipse,rgba(124,58,237,0.12)_0%,transparent_70%)]" />
        <div className="absolute right-[10%] top-[40%] h-[400px] w-[400px] bg-[radial-gradient(ellipse,rgba(6,182,212,0.06)_0%,transparent_70%)]" />
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage:
              "radial-gradient(rgba(255,255,255,0.7) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      <main className="relative z-10 mx-auto max-w-4xl px-6 pb-24 pt-28">
        <motion.div
          className="mb-10 text-center"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="mb-3 text-3xl font-bold tracking-tight text-white md:text-4xl">
            Download Video
          </h1>
          <p className="text-base text-white/40">
            Paste a video URL to analyze and download in your preferred quality
          </p>
        </motion.div>

        <motion.div
          className="relative mb-6"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="group relative">
            <div
              className={cn(
                "absolute -inset-1 rounded-2xl bg-gradient-to-r blur-xl transition-all duration-500",
                parseState === "parsing"
                  ? "animate-glow from-violet-500/40 via-purple-500/40 to-fuchsia-500/40"
                  : "animate-glow from-violet-600/25 via-purple-600/25 to-fuchsia-600/25"
              )}
            />
            <div
              className={cn(
                "relative flex items-center gap-2 rounded-xl border p-2 backdrop-blur-sm transition-all duration-300",
                parseState === "parsing"
                  ? "border-violet-500/30"
                  : "border-white/[0.08] hover:border-violet-500/20"
              )}
            >
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && parseState !== "parsing") {
                    handleParse();
                  }
                }}
                placeholder="Paste video URL here..."
                disabled={parseState === "parsing"}
                className="min-w-0 flex-1 bg-transparent px-4 py-2.5 text-sm text-white outline-none placeholder:text-white/25 disabled:opacity-50 md:text-base"
              />
              <button
                type="button"
                onClick={() => handleParse()}
                disabled={parseState === "parsing"}
                className={cn(
                  "flex shrink-0 items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold transition-all",
                  parseState === "parsing"
                    ? "cursor-wait bg-violet-600/50 text-white/70"
                    : "cursor-pointer bg-gradient-to-r from-violet-600 to-purple-600 text-white hover:from-violet-500 hover:to-purple-500 hover:shadow-[0_0_24px_rgba(124,58,237,0.3)] active:scale-[0.97]"
                )}
              >
                {parseState === "parsing" ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    <span className="hidden sm:inline">Parsing...</span>
                  </>
                ) : (
                  <>
                    <Search className="size-4" />
                    <span className="hidden sm:inline">Parse</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {parseState === "idle" && (
            <motion.div
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="mb-16 text-center"
            >
              <p className="text-xs text-white/25">
                Supported:{" "}
                {supportedPlatforms.map((p, i) => (
                  <span key={p}>
                    <span className="text-white/35">{p}</span>
                    {i < supportedPlatforms.length - 1 && (
                      <span className="text-white/15"> · </span>
                    )}
                  </span>
                ))}
              </p>
            </motion.div>
          )}

          {parseState === "parsing" && (
            <motion.div
              key="parsing"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="flex flex-col items-center justify-center gap-3 py-12"
            >
              <div className="relative flex size-10 items-center justify-center">
                <div className="absolute inset-0 animate-ping rounded-full bg-violet-500/20" />
                <Loader2 className="size-5 animate-spin text-violet-400" />
              </div>
              <p className="text-sm text-white/40">Analyzing URL...</p>
            </motion.div>
          )}

          {parseState === "error" && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="mb-16 flex flex-col items-center gap-3 py-8"
            >
              <div className="flex items-center gap-2 text-red-400">
                <AlertCircle className="size-4" />
                <span className="text-sm">{error}</span>
              </div>
              <button
                type="button"
                onClick={handleReset}
                className="flex cursor-pointer items-center gap-1.5 text-xs text-white/40 transition-colors hover:text-white/60"
              >
                <RotateCcw className="size-3" />
                Try again
              </button>
            </motion.div>
          )}

          {parseState === "success" && parsedVideo && (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 32, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.98 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="mb-16"
            >
              <VideoResultCard video={parsedVideo} />
              <div className="mt-4 text-center">
                <button
                  type="button"
                  onClick={handleReset}
                  className="cursor-pointer text-xs text-white/25 transition-colors hover:text-white/45"
                >
                  Parse another URL
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {authStatus === "authenticated" && (
          <section className="border-t border-white/[0.06] pt-10">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="size-4 text-white/25" />
                <h2 className="text-sm font-semibold text-white/50">Recent Downloads</h2>
              </div>
              <a href="/dashboard" className="text-xs text-violet-400 hover:text-violet-300 transition-colors">
                View all →
              </a>
            </div>

            {loadingRecent ? (
              <div className="flex items-center justify-center py-10">
                <Loader2 className="size-5 animate-spin text-violet-400/40" />
              </div>
            ) : recentDownloads.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-white/[0.06] py-12">
                <p className="text-sm text-white/20">
                  No downloads yet. Paste a video URL above to get started.
                </p>
              </div>
            ) : (
              <div className="rounded-xl border border-white/[0.06] divide-y divide-white/[0.04]">
                {recentDownloads.map((dl) => (
                  <div key={dl.id} className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-white/[0.02]">
                    <PlatformIcon platform={dl.platform} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm text-white/70">{dl.title || dl.url}</p>
                      <div className="mt-0.5 flex items-center gap-2 text-xs text-white/30">
                        <span className="capitalize">{dl.platform}</span>
                        {dl.quality && <><span>·</span><span>{dl.quality}</span></>}
                        <span>·</span>
                        <span>{timeAgo(dl.createdAt)}</span>
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-1.5">
                      {STATUS_ICON[dl.status] ?? <Clock className="size-3.5 text-white/20" />}
                    </div>
                    <a
                      href={dl.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 text-white/20 transition-colors hover:text-white/50"
                    >
                      <ExternalLink className="size-3.5" />
                    </a>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
}

export default function DownloadPage() {
  return (
    <Suspense
      fallback={
        <div className="relative min-h-screen">
          <Navbar />
          <div className="flex items-center justify-center pt-40">
            <Loader2 className="size-6 animate-spin text-violet-400" />
          </div>
        </div>
      }
    >
      <DownloadPageContent />
    </Suspense>
  );
}
