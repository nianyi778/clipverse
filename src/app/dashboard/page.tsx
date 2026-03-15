"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Download,
  Zap,
  Crown,
  Key,
  LogOut,
  ExternalLink,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  ArrowUpRight,
  Loader2,
  RefreshCw,
  Youtube,
  Globe,
  Plus,
  Trash2,
  Copy,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Navbar } from "@/components/navbar";

const PLAN_LABELS: Record<string, string> = {
  free: "Free",
  pro: "Pro",
  lifetime: "Lifetime",
  team: "Team",
};

const PLAN_COLORS: Record<string, string> = {
  free: "text-white/50 border-white/10 bg-white/[0.03]",
  pro: "text-violet-300 border-violet-500/30 bg-violet-500/10",
  lifetime: "text-amber-300 border-amber-500/30 bg-amber-500/10",
  team: "text-cyan-300 border-cyan-500/30 bg-cyan-500/10",
};

const STATUS_ICON: Record<string, React.ReactNode> = {
  completed: <CheckCircle className="size-3.5 text-emerald-400" />,
  failed: <XCircle className="size-3.5 text-red-400" />,
  processing: <Loader2 className="size-3.5 animate-spin text-violet-400" />,
  pending: <Clock className="size-3.5 text-white/30" />,
};

const PLATFORM_ICON: Record<string, React.ReactNode> = {
  youtube: <Youtube className="size-3.5 text-red-400" />,
  bilibili: <Globe className="size-3.5 text-blue-400" />,
};

function platformIcon(platform: string) {
  return PLATFORM_ICON[platform.toLowerCase()] ?? <Globe className="size-3.5 text-white/30" />;
}

function timeAgo(date: string | Date) {
  const d = new Date(date);
  const now = Date.now();
  const diff = now - d.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

interface ProfileData {
  id: string;
  email: string;
  name: string | null;
  avatarUrl: string | null;
  plan: string;
  totalDownloads: number;
  dailyQuota: { used: number; limit: number; remaining: number };
  subscription: { status: string; currentPeriodEnd: string | null; cancelAtPeriodEnd: boolean } | null;
}

interface ApiKeyRecord {
  id: string;
  name: string;
  keyPreview: string;
  lastUsedAt: string | null;
  requestCount: number;
  createdAt: string;
}

interface DownloadRecord {
  id: string;
  url: string;
  platform: string;
  title: string | null;
  quality: string | null;
  status: string;
  createdAt: string;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [downloads, setDownloads] = useState<DownloadRecord[]>([]);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadingDownloads, setLoadingDownloads] = useState(true);
  const [error, setError] = useState("");
  const [apiKeys, setApiKeys] = useState<ApiKeyRecord[]>([]);
  const [loadingKeys, setLoadingKeys] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [creatingKey, setCreatingKey] = useState(false);
  const [newKeyValue, setNewKeyValue] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState(false);
  const [deletingKeyId, setDeletingKeyId] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (status !== "authenticated") return;
    fetch("/api/user/profile")
      .then((r) => r.json())
      .then((d) => { if (d.success) setProfile(d.user); else setError(d.error); })
      .catch(() => setError("Failed to load profile"))
      .finally(() => setLoadingProfile(false));

    fetch("/api/user/downloads")
      .then((r) => r.json())
      .then((d) => { if (d.success) setDownloads(d.downloads); })
      .catch(() => {})
      .finally(() => setLoadingDownloads(false));
  }, [status]);

  useEffect(() => {
    if (!profile) return;
    if (profile.plan !== "lifetime" && profile.plan !== "team") return;
    setLoadingKeys(true);
    fetch("/api/user/api-keys")
      .then((r) => r.json())
      .then((d) => { if (d.success) setApiKeys(d.keys); })
      .catch(() => {})
      .finally(() => setLoadingKeys(false));
  }, [profile]);

  async function handleCreateKey() {
    setCreatingKey(true);
    try {
      const res = await fetch("/api/user/api-keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newKeyName || "My API Key" }),
      });
      const data = await res.json();
      if (data.success) {
        setNewKeyValue(data.key);
        setNewKeyName("");
        const newEntry: ApiKeyRecord = {
          id: data.id,
          name: data.name,
          keyPreview: `cv_...${data.key.slice(-8)}`,
          lastUsedAt: null,
          requestCount: 0,
          createdAt: new Date().toISOString(),
        };
        setApiKeys((prev) => [newEntry, ...prev]);
      }
    } finally {
      setCreatingKey(false);
    }
  }

  async function handleDeleteKey(id: string) {
    setDeletingKeyId(id);
    try {
      const res = await fetch(`/api/user/api-keys/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) setApiKeys((prev) => prev.filter((k) => k.id !== id));
    } finally {
      setDeletingKeyId(null);
    }
  }

  function handleCopyKey(key: string) {
    navigator.clipboard.writeText(key).then(() => {
      setCopiedKey(true);
      setTimeout(() => setCopiedKey(false), 2000);
    });
  }

  if (status === "loading" || (status === "authenticated" && loadingProfile)) {
    return (
      <div className="relative min-h-screen">
        <Navbar />
        <div className="flex items-center justify-center pt-40">
          <Loader2 className="size-6 animate-spin text-violet-400" />
        </div>
      </div>
    );
  }

  if (!session?.user || !profile) {
    return null;
  }

  const quotaPct = profile.dailyQuota.limit > 0
    ? Math.min(100, (profile.dailyQuota.used / profile.dailyQuota.limit) * 100)
    : 0;

  const avatarLetter = (profile.name?.[0] || profile.email[0] || "U").toUpperCase();

  return (
    <div className="relative min-h-screen">
      <Navbar />

      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-1/4 top-[10%] h-[500px] w-[600px] bg-[radial-gradient(ellipse,rgba(124,58,237,0.08)_0%,transparent_70%)]" />
      </div>

      <main className="relative z-10 mx-auto max-w-5xl px-6 pb-24 pt-28">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>

          {error && (
            <div className="mb-6 flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              <AlertCircle className="size-4 shrink-0" />
              {error}
            </div>
          )}

          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              {profile.avatarUrl ? (
                <img src={profile.avatarUrl} alt="" className="size-14 rounded-full ring-2 ring-white/10" referrerPolicy="no-referrer" />
              ) : (
                <div className="flex size-14 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-purple-600 text-xl font-bold text-white">
                  {avatarLetter}
                </div>
              )}
              <div>
                <h1 className="text-xl font-bold text-white">{profile.name || profile.email.split("@")[0]}</h1>
                <p className="text-sm text-white/40">{profile.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className={cn("rounded-full border px-3 py-1 text-xs font-semibold", PLAN_COLORS[profile.plan])}>
                {PLAN_LABELS[profile.plan] || profile.plan}
              </span>
              <button
                type="button"
                onClick={() => signOut({ callbackUrl: "/" })}
                className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-white/[0.08] px-3 py-1.5 text-xs text-white/50 transition-colors hover:text-white"
              >
                <LogOut className="size-3.5" />
                Sign out
              </button>
            </div>
          </div>

          <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {[
              { label: "Total Downloads", value: profile.totalDownloads, icon: <Download className="size-4 text-violet-400" /> },
              { label: "Today's Downloads", value: profile.dailyQuota.used, icon: <Zap className="size-4 text-cyan-400" /> },
              { label: "Daily Remaining", value: profile.dailyQuota.remaining, icon: <RefreshCw className="size-4 text-emerald-400" /> },
              { label: "Plan", value: PLAN_LABELS[profile.plan] || profile.plan, icon: <Crown className="size-4 text-amber-400" /> },
            ].map((stat) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5"
              >
                <div className="mb-3 flex items-center gap-2">
                  {stat.icon}
                  <span className="text-xs text-white/40">{stat.label}</span>
                </div>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="mb-6 rounded-xl border border-white/[0.06] bg-white/[0.02] p-5"
          >
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-medium text-white/70">Daily Download Quota</span>
              <span className="text-sm text-white/40">
                {profile.dailyQuota.used} / {profile.dailyQuota.limit}
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-white/[0.06]">
              <motion.div
                className={cn(
                  "h-full rounded-full",
                  quotaPct >= 90 ? "bg-red-500" : quotaPct >= 70 ? "bg-amber-500" : "bg-violet-500"
                )}
                initial={{ width: 0 }}
                animate={{ width: `${quotaPct}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </div>
            {profile.plan === "free" && (
              <div className="mt-3 flex items-center justify-between">
                <p className="text-xs text-white/30">Free plan: 5 downloads/day</p>
                <a
                  href="/pricing"
                  className="flex items-center gap-1 text-xs text-violet-400 transition-colors hover:text-violet-300"
                >
                  Upgrade <ArrowUpRight className="size-3" />
                </a>
              </div>
            )}
          </motion.div>

          {profile.subscription && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.15 }}
              className="mb-6 rounded-xl border border-violet-500/20 bg-violet-500/[0.04] p-5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Crown className="size-4 text-violet-400" />
                  <span className="text-sm font-medium text-white/80">Active Subscription</span>
                </div>
                <span className={cn(
                  "rounded-full px-2 py-0.5 text-xs font-medium",
                  profile.subscription.status === "active" ? "bg-emerald-500/20 text-emerald-400" : "bg-amber-500/20 text-amber-400"
                )}>
                  {profile.subscription.status}
                </span>
              </div>
              {profile.subscription.currentPeriodEnd && (
                <p className="mt-2 text-xs text-white/30">
                  {profile.subscription.cancelAtPeriodEnd ? "Cancels" : "Renews"} on{" "}
                  {new Date(profile.subscription.currentPeriodEnd).toLocaleDateString()}
                </p>
              )}
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="rounded-xl border border-white/[0.06] bg-white/[0.02]"
          >
            <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-4">
              <div className="flex items-center gap-2">
                <Clock className="size-4 text-white/30" />
                <h2 className="text-sm font-semibold text-white/70">Download History</h2>
              </div>
              <a href="/download" className="flex items-center gap-1 text-xs text-violet-400 hover:text-violet-300">
                New download <ExternalLink className="size-3" />
              </a>
            </div>

            {loadingDownloads ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="size-5 animate-spin text-violet-400/50" />
              </div>
            ) : downloads.length === 0 ? (
              <div className="flex flex-col items-center gap-2 py-12">
                <Download className="size-8 text-white/10" />
                <p className="text-sm text-white/25">No downloads yet</p>
                <a href="/download" className="mt-1 text-xs text-violet-400 hover:text-violet-300">
                  Download your first video →
                </a>
              </div>
            ) : (
              <div className="divide-y divide-white/[0.04]">
                {downloads.map((dl) => (
                  <div key={dl.id} className="flex items-center gap-3 px-5 py-3.5 transition-colors hover:bg-white/[0.02]">
                    <div className="shrink-0">{platformIcon(dl.platform)}</div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm text-white/70">
                        {dl.title || dl.url}
                      </p>
                      <div className="mt-0.5 flex items-center gap-2 text-xs text-white/30">
                        <span className="capitalize">{dl.platform}</span>
                        {dl.quality && <><span>·</span><span>{dl.quality}</span></>}
                        <span>·</span>
                        <span>{timeAgo(dl.createdAt)}</span>
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-1.5">
                      {STATUS_ICON[dl.status] ?? <Clock className="size-3.5 text-white/20" />}
                      <span className="hidden text-xs capitalize text-white/25 sm:block">{dl.status}</span>
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
          </motion.div>

          {(profile.plan === "lifetime" || profile.plan === "team") && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.25 }}
              className="mt-6 rounded-xl border border-white/[0.06] bg-white/[0.02]"
            >
              <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-4">
                <div className="flex items-center gap-2">
                  <Key className="size-4 text-white/30" />
                  <h2 className="text-sm font-semibold text-white/70">API Keys</h2>
                </div>
                <div className="flex items-center gap-3">
                  <a
                    href="/developers"
                    className="text-xs text-violet-400 transition-colors hover:text-violet-300"
                  >
                    Developer mode
                  </a>
                  <span className="text-xs text-white/30">{apiKeys.length}/10 keys</span>
                </div>
              </div>

              {newKeyValue && (
                <div className="mx-5 mt-4 rounded-lg border border-emerald-500/20 bg-emerald-500/[0.06] p-4">
                  <p className="mb-2 text-xs font-medium text-emerald-400">Key created — copy it now, it won&apos;t be shown again</p>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 truncate rounded bg-black/30 px-3 py-2 font-mono text-xs text-white/80">
                      {newKeyValue}
                    </code>
                    <button
                      type="button"
                      onClick={() => handleCopyKey(newKeyValue)}
                      className="shrink-0 rounded-lg border border-white/[0.08] p-2 text-white/50 transition-colors hover:text-white"
                    >
                      {copiedKey ? <Check className="size-3.5 text-emerald-400" /> : <Copy className="size-3.5" />}
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => setNewKeyValue(null)}
                    className="mt-2 text-xs text-white/30 hover:text-white/50"
                  >
                    I&apos;ve saved it, dismiss
                  </button>
                </div>
              )}

              <div className="p-5">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter" && !creatingKey) handleCreateKey(); }}
                    placeholder="Key name (e.g. My App)"
                    maxLength={100}
                    className="flex-1 rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-2 text-sm text-white outline-none placeholder:text-white/25 focus:border-violet-500/40"
                  />
                  <button
                    type="button"
                    onClick={handleCreateKey}
                    disabled={creatingKey || apiKeys.length >= 10}
                    className="flex shrink-0 cursor-pointer items-center gap-1.5 rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {creatingKey ? <Loader2 className="size-3.5 animate-spin" /> : <Plus className="size-3.5" />}
                    Generate
                  </button>
                </div>

                {loadingKeys ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="size-4 animate-spin text-violet-400/40" />
                  </div>
                ) : apiKeys.length === 0 ? (
                  <p className="mt-4 text-center text-xs text-white/25">No API keys yet. Generate one above.</p>
                ) : (
                  <div className="mt-4 divide-y divide-white/[0.04] rounded-lg border border-white/[0.06]">
                    {apiKeys.map((k) => (
                      <div key={k.id} className="flex items-center gap-3 px-4 py-3">
                        <div className="min-w-0 flex-1">
                          <p className="text-sm text-white/80">{k.name}</p>
                          <code className="text-xs text-white/35 font-mono">{k.keyPreview}</code>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-xs text-white/30">{k.requestCount} reqs</p>
                          {k.lastUsedAt && (
                            <p className="text-xs text-white/20">{timeAgo(k.lastUsedAt)}</p>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => handleDeleteKey(k.id)}
                          disabled={deletingKeyId === k.id}
                          className="shrink-0 cursor-pointer rounded p-1.5 text-white/20 transition-colors hover:bg-red-500/10 hover:text-red-400 disabled:opacity-40"
                        >
                          {deletingKeyId === k.id ? <Loader2 className="size-3.5 animate-spin" /> : <Trash2 className="size-3.5" />}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}

        </motion.div>
      </main>
    </div>
  );
}
