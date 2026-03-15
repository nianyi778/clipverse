"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import {
  Blocks,
  KeyRound,
  Orbit,
  ShieldCheck,
  Sparkles,
  TerminalSquare,
  FileJson2,
  BookOpenText,
  Copy,
  Check,
  ArrowUpRight,
  Plus,
  Trash2,
  Loader2,
} from "lucide-react";
import { Navbar } from "@/components/navbar";

interface DeveloperData {
  user: {
    email: string;
    name: string | null;
    plan: string;
  };
  featureAccess: {
    enabled: boolean;
    rest: boolean;
    mcp: boolean;
  };
  allowedPlans: {
    rest: string[];
    mcp: string[];
  };
  apiKeys: Array<{
    id: string;
    name: string;
    keyPreview: string;
    requestCount: number;
    lastUsedAt: string | null;
  }>;
  endpoints: {
    docs: string;
    openapi: string;
    mcp: string;
    discovery: string;
  };
  inventory: {
    tools: Array<{ name: string; title: string; description: string }>;
    resources: Array<{ uri: string; title: string; description: string }>;
    prompts: Array<{ name: string; title: string; description: string }>;
  };
}

function timeAgo(date: string | null) {
  if (!date) return "未使用";
  const diff = Date.now() - new Date(date).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "刚刚";
  if (minutes < 60) return `${minutes} 分钟前`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} 小时前`;
  return `${Math.floor(hours / 24)} 天前`;
}

export default function DevelopersPage() {
  const { status } = useSession();
  const router = useRouter();
  const [data, setData] = useState<DeveloperData | null>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState("");
  const [newKeyName, setNewKeyName] = useState("");
  const [creatingKey, setCreatingKey] = useState(false);
  const [deletingKeyId, setDeletingKeyId] = useState("");
  const [newKeyValue, setNewKeyValue] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [router, status]);

  useEffect(() => {
    if (status !== "authenticated") return;
    fetch("/api/user/developer")
      .then((res) => res.json())
      .then((json) => {
        if (json.success) setData(json.developer);
        else setError(json.error || "Failed to load developer console");
      })
      .catch(() => setError("Failed to load developer console"));
  }, [status]);

  async function copyValue(value: string) {
    await navigator.clipboard.writeText(value);
    setCopied(value);
    setTimeout(() => setCopied(""), 1500);
  }

  async function handleCreateKey() {
    if (!data) return;
    setCreatingKey(true);
    setError("");
    try {
      const res = await fetch("/api/user/api-keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newKeyName || "My API Key" }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Failed to create API key");

      setNewKeyValue(json.key);
      setNewKeyName("");
      setData({
        ...data,
        apiKeys: [
          {
            id: json.id,
            name: json.name,
            keyPreview: `cv_...${json.key.slice(-8)}`,
            requestCount: 0,
            lastUsedAt: null,
          },
          ...data.apiKeys,
        ],
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create API key");
    } finally {
      setCreatingKey(false);
    }
  }

  async function handleDeleteKey(id: string) {
    if (!data) return;
    setDeletingKeyId(id);
    setError("");
    try {
      const res = await fetch(`/api/user/api-keys/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Failed to delete API key");

      setData({
        ...data,
        apiKeys: data.apiKeys.filter((key) => key.id !== id),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete API key");
    } finally {
      setDeletingKeyId("");
    }
  }

  if (status === "loading" || (status === "authenticated" && !data && !error)) {
    return (
      <div className="min-h-screen bg-[#061115] text-white">
        <Navbar />
        <div className="mx-auto flex max-w-6xl items-center justify-center px-6 pt-40 text-sm text-white/45">
          正在加载开发者控制台...
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-[#061115] text-white">
        <Navbar />
        <div className="mx-auto max-w-3xl px-6 pt-40">
          <div className="rounded-3xl border border-red-400/20 bg-red-500/10 p-6 text-sm text-red-200">
            {error || "开发者控制台暂不可用"}
          </div>
        </div>
      </div>
    );
  }

  const panels = [
    { label: "REST Access", value: data.featureAccess.rest ? "Enabled" : "Blocked", icon: <TerminalSquare className="size-4 text-cyan-300" /> },
    { label: "MCP Access", value: data.featureAccess.mcp ? "Enabled" : "Blocked", icon: <Blocks className="size-4 text-amber-300" /> },
    { label: "API Keys", value: String(data.apiKeys.length), icon: <KeyRound className="size-4 text-emerald-300" /> },
    { label: "Plan", value: data.user.plan, icon: <ShieldCheck className="size-4 text-violet-300" /> },
  ];

  return (
    <div className="min-h-screen overflow-hidden bg-[#061115] text-white">
      <Navbar />

      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.12),transparent_28%),radial-gradient(circle_at_78%_18%,rgba(250,204,21,0.09),transparent_22%),radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.08),transparent_28%)]" />
        <div className="absolute inset-0 opacity-[0.08]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
      </div>

      <main className="relative z-10 mx-auto max-w-6xl px-6 pb-24 pt-28">
        {error && (
          <div className="mb-6 rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {error}
          </div>
        )}

        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8 overflow-hidden rounded-[30px] border border-white/10 bg-[linear-gradient(135deg,rgba(7,20,25,0.96),rgba(5,12,16,0.9))] p-8 shadow-[0_20px_80px_rgba(0,0,0,0.35)]"
        >
          <div className="mb-6 flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-cyan-200">
              Developer Console
            </span>
            <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/45">
              REST + MCP + Resources + Prompts
            </span>
          </div>

          <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
            <div>
              <h1 className="max-w-3xl font-serif text-4xl leading-tight text-white">
                把 ClipVerse 当成一块可编排的视频基础设施来用
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-white/58">
                独立控制台把 API Keys、OpenAPI、MCP 端点、资源文档和提示词模板放到同一视图。
                你的第三方服务、工作流平台和 Agent 可以从这里拿到完整接入面。
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <a href={data.endpoints.openapi} className="rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-black">
                  OpenAPI
                </a>
                <a href={data.endpoints.docs} className="rounded-xl border border-white/10 px-4 py-2.5 text-sm font-semibold text-white/80">
                  开发者文档
                </a>
                <a href={data.endpoints.discovery} className="rounded-xl border border-cyan-300/20 bg-cyan-300/10 px-4 py-2.5 text-sm font-semibold text-cyan-200">
                  MCP Discovery
                </a>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {panels.map((panel) => (
                <div key={panel.label} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-sm">
                  <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-white/35">
                    {panel.icon}
                    {panel.label}
                  </div>
                  <div className="text-2xl font-semibold text-white">{panel.value}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        <div className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr]">
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05 }}
            className="space-y-6"
          >
            <div className="rounded-[28px] border border-white/10 bg-black/20 p-6">
              <div className="mb-4 flex items-center gap-2 text-sm font-medium text-white/78">
                <ShieldCheck className="size-4 text-emerald-300" />
                Feature Gating
              </div>
              <div className="space-y-3 text-sm text-white/58">
                <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                  开发者模式：<span className="text-white">{data.featureAccess.enabled ? "已启用" : "已关闭"}</span>
                </div>
                <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                  REST 允许套餐：<span className="text-white">{data.allowedPlans.rest.join(", ")}</span>
                </div>
                <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                  MCP 允许套餐：<span className="text-white">{data.allowedPlans.mcp.join(", ")}</span>
                </div>
              </div>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-black/20 p-6">
              <div className="mb-4 flex items-center gap-2 text-sm font-medium text-white/78">
                <KeyRound className="size-4 text-amber-300" />
                API Keys
              </div>
              {newKeyValue && (
                <div className="mb-4 rounded-2xl border border-emerald-300/20 bg-emerald-400/10 p-4">
                  <div className="mb-2 text-sm text-emerald-200">新 API Key 已创建，只显示这一次</div>
                  <div className="flex items-center gap-3">
                    <code className="flex-1 break-all rounded-xl bg-black/30 px-3 py-2 font-mono text-xs text-white/85">
                      {newKeyValue}
                    </code>
                    <button
                      type="button"
                      onClick={() => copyValue(newKeyValue)}
                      className="rounded-lg border border-white/10 p-2 text-white/60 transition-colors hover:text-white"
                    >
                      {copied === newKeyValue ? <Check className="size-3.5 text-emerald-300" /> : <Copy className="size-3.5" />}
                    </button>
                  </div>
                </div>
              )}
              <div className="mb-4 flex gap-3">
                <input
                  type="text"
                  value={newKeyName}
                  onChange={(event) => setNewKeyName(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && !creatingKey) handleCreateKey();
                  }}
                  placeholder="例如：Zapier Worker"
                  maxLength={100}
                  className="flex-1 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none placeholder:text-white/28"
                />
                <button
                  type="button"
                  onClick={handleCreateKey}
                  disabled={creatingKey}
                  className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-black disabled:opacity-50"
                >
                  {creatingKey ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />}
                  创建
                </button>
              </div>
              <div className="space-y-3">
                {data.apiKeys.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-white/12 p-4 text-sm text-white/40">
                    还没有 API Key。直接在这里创建一把，然后接入第三方。
                  </div>
                ) : (
                  data.apiKeys.map((key) => (
                    <div key={key.id} className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                      <div className="mb-1 flex items-center justify-between gap-3">
                        <div className="text-sm text-white">{key.name}</div>
                        <button
                          type="button"
                          onClick={() => handleDeleteKey(key.id)}
                          disabled={deletingKeyId === key.id}
                          className="rounded-lg border border-white/10 p-2 text-white/50 transition-colors hover:border-red-300/30 hover:text-red-200 disabled:opacity-50"
                        >
                          {deletingKeyId === key.id ? <Loader2 className="size-3.5 animate-spin" /> : <Trash2 className="size-3.5" />}
                        </button>
                      </div>
                      <div className="font-mono text-xs text-white/45">{key.keyPreview}</div>
                      <div className="mt-3 flex items-center justify-between text-xs text-white/35">
                        <span>{key.requestCount} requests</span>
                        <span>{timeAgo(key.lastUsedAt)}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="space-y-6"
          >
            <div className="rounded-[28px] border border-white/10 bg-black/20 p-6">
              <div className="mb-4 flex items-center gap-2 text-sm font-medium text-white/78">
                <Orbit className="size-4 text-cyan-300" />
                Runtime Endpoints
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                {[
                  { label: "Docs", value: data.endpoints.docs, icon: <BookOpenText className="size-4 text-cyan-300" /> },
                  { label: "OpenAPI", value: data.endpoints.openapi, icon: <FileJson2 className="size-4 text-emerald-300" /> },
                  { label: "Discovery", value: data.endpoints.discovery, icon: <Sparkles className="size-4 text-amber-300" /> },
                  { label: "MCP", value: data.endpoints.mcp, icon: <Blocks className="size-4 text-violet-300" /> },
                ].map((item) => (
                  <div key={item.label} className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                    <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-white/35">
                      {item.icon}
                      {item.label}
                    </div>
                    <div className="flex items-start justify-between gap-3">
                      <code className="break-all text-xs leading-6 text-white/62">{item.value}</code>
                      <button
                        type="button"
                        onClick={() => copyValue(item.value)}
                        className="rounded-lg border border-white/10 p-2 text-white/55 transition-colors hover:text-white"
                      >
                        {copied === item.value ? <Check className="size-3.5 text-emerald-300" /> : <Copy className="size-3.5" />}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-6 xl:grid-cols-3">
              <div className="rounded-[28px] border border-white/10 bg-black/20 p-6 xl:col-span-1">
                <div className="mb-4 flex items-center gap-2 text-sm font-medium text-white/78">
                  <TerminalSquare className="size-4 text-cyan-300" />
                  MCP Tools
                </div>
                <div className="space-y-3">
                  {data.inventory.tools.map((tool) => (
                    <div key={tool.name} className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                      <div className="text-sm text-white">{tool.title}</div>
                      <div className="mt-1 font-mono text-[11px] text-cyan-200/70">{tool.name}</div>
                      <p className="mt-2 text-xs leading-6 text-white/42">{tool.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[28px] border border-white/10 bg-black/20 p-6 xl:col-span-1">
                <div className="mb-4 flex items-center gap-2 text-sm font-medium text-white/78">
                  <BookOpenText className="size-4 text-amber-300" />
                  MCP Resources
                </div>
                <div className="space-y-3">
                  {data.inventory.resources.map((resource) => (
                    <div key={resource.uri} className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                      <div className="text-sm text-white">{resource.title}</div>
                      <div className="mt-1 font-mono text-[11px] text-amber-200/70">{resource.uri}</div>
                      <p className="mt-2 text-xs leading-6 text-white/42">{resource.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[28px] border border-white/10 bg-black/20 p-6 xl:col-span-1">
                <div className="mb-4 flex items-center gap-2 text-sm font-medium text-white/78">
                  <Sparkles className="size-4 text-violet-300" />
                  MCP Prompts
                </div>
                <div className="space-y-3">
                  {data.inventory.prompts.map((prompt) => (
                    <div key={prompt.name} className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                      <div className="text-sm text-white">{prompt.title}</div>
                      <div className="mt-1 font-mono text-[11px] text-violet-200/70">{prompt.name}</div>
                      <p className="mt-2 text-xs leading-6 text-white/42">{prompt.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.section>
        </div>

        <div className="mt-8 flex justify-end">
          <a
            href="/api-docs"
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 text-sm font-semibold text-white/80 transition-colors hover:text-white"
          >
            查看开发者文档
            <ArrowUpRight className="size-4" />
          </a>
        </div>
      </main>
    </div>
  );
}
