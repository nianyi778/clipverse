"use client";

import { motion } from "framer-motion";
import {
  Code2,
  KeyRound,
  Blocks,
  ShieldCheck,
  ArrowUpRight,
  TerminalSquare,
  Workflow,
} from "lucide-react";
import { Navbar } from "@/components/navbar";

const restEndpoints = [
  {
    method: "POST",
    path: "/api/parse",
    description: "解析视频页面，返回标题、作者、时长、视频格式、音频格式和字幕轨。",
    body: `{
  "url": "https://www.douyin.com/video/7153585060275425572"
}`,
  },
  {
    method: "POST",
    path: "/api/download",
    description: "基于 `formatId` 生成下载地址；当音视频分离时会自动提示需要服务端合流。",
    body: `{
  "url": "https://www.douyin.com/video/7153585060275425572",
  "formatId": "h264_1080p",
  "type": "video",
  "audioFormatId": "audio_128k"
}`,
  },
  {
    method: "POST",
    path: "/api/subtitles",
    description: "获取字幕和自动字幕轨道。",
    body: `{
  "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
}`,
  },
  {
    method: "POST",
    path: "/api/batch",
    description: "批量解析，单次最多 10 条 URL。",
    body: `{
  "urls": [
    "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    "https://www.bilibili.com/video/BV1GJ411x7h7"
  ]
}`,
  },
];

const mcpTools = [
  "clipverse_parse_video",
  "clipverse_get_download",
  "clipverse_get_subtitles",
  "clipverse_batch_parse",
];

const curlExample = `curl -X POST "$ORIGIN/api/parse" \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer $CLIPVERSE_API_KEY" \\
  -d '{
    "url": "https://www.douyin.com/video/7153585060275425572"
  }'`;

const mcpInitialize = `{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "initialize",
  "params": {
    "protocolVersion": "2024-11-05",
    "capabilities": {},
    "clientInfo": {
      "name": "your-client",
      "version": "1.0.0"
    }
  }
}`;

const mcpCall = `{
  "jsonrpc": "2.0",
  "id": 2,
  "method": "tools/call",
  "params": {
    "name": "clipverse_parse_video",
    "arguments": {
      "url": "https://www.douyin.com/video/7153585060275425572"
    }
  }
}`;

const claudeConfig = `{
  "mcpServers": {
    "clipverse": {
      "type": "http",
      "url": "$ORIGIN/api/mcp",
      "headers": {
        "Authorization": "Bearer CLIPVERSE_API_KEY"
      }
    }
  }
}`;

const openApiLikeDiscovery = `GET $ORIGIN/.well-known/mcp`;
const openApiSpec = `GET $ORIGIN/openapi.json`;
const repoTemplate = `templates/mcp/clipverse.mcp.json`;

export default function APIDocsPage() {
  const origin = typeof window !== "undefined" ? window.location.origin : "https://clipverse.divinations.top";
  const mcpEndpoint = `${origin}/api/mcp`;
  const discoveryEndpoint = `${origin}/.well-known/mcp`;

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#05070b]">
      <Navbar />

      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[10%] top-24 h-80 w-80 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute right-[12%] top-40 h-96 w-96 rounded-full bg-violet-500/10 blur-3xl" />
        <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
      </div>

      <main className="relative z-10 mx-auto max-w-6xl px-6 pb-24 pt-28">
        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="mb-8 overflow-hidden rounded-[28px] border border-white/[0.08] bg-white/[0.03] p-8 backdrop-blur-xl"
        >
          <div className="mb-5 flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs font-semibold tracking-[0.18em] text-cyan-300 uppercase">
              Developer Mode
            </span>
            <span className="rounded-full border border-white/[0.08] px-3 py-1 text-xs text-white/45">
              REST + MCP
            </span>
          </div>

          <div className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr]">
            <div>
              <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-white">
                为第三方系统开放 ClipVerse 下载与解析能力
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-white/55">
                现在同一套 API Key 同时支持 REST 接口和 MCP 工具调用。外部 SaaS、自动化平台、AI Agent
                或内部服务都可以直接接入，不需要再绕浏览器页面。
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href="/dashboard"
                  className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-black transition-transform hover:scale-[1.02]"
                >
                  管理 API Key
                  <ArrowUpRight className="size-4" />
                </a>
                <a
                  href="#mcp"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/[0.1] px-4 py-2.5 text-sm font-semibold text-white/75 transition-colors hover:border-white/[0.18] hover:text-white"
                >
                  查看 MCP 接入
                </a>
                <a
                  href="/openapi.json"
                  className="inline-flex items-center gap-2 rounded-xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-2.5 text-sm font-semibold text-cyan-200 transition-colors hover:bg-cyan-400/15"
                >
                  OpenAPI JSON
                </a>
              </div>
            </div>

            <div className="rounded-2xl border border-white/[0.08] bg-black/30 p-4">
              <div className="mb-3 flex items-center gap-2 text-sm font-medium text-white/75">
                <TerminalSquare className="size-4 text-cyan-300" />
                快速开始
              </div>
              <div className="space-y-3 text-sm text-white/55">
                <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-3">
                  1. 在 Dashboard 生成 `cv_` 开头的 API Key
                </div>
                <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-3">
                  2. REST 调用带 `Authorization: Bearer &lt;key&gt;`
                </div>
                <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-3">
                  3. MCP 客户端把端点指向 `{mcpEndpoint}`
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.05 }}
          className="mb-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4"
        >
          {[
            {
              icon: <KeyRound className="size-4 text-amber-300" />,
              title: "统一认证",
              text: "API Key 同时适用于 REST 和 MCP，错误 Key 会直接返回 401。",
            },
            {
              icon: <Blocks className="size-4 text-cyan-300" />,
              title: "MCP 工具",
              text: "支持视频解析、下载地址生成、字幕获取和批量解析。",
            },
            {
              icon: <ShieldCheck className="size-4 text-emerald-300" />,
              title: "权限分层",
              text: "开发者模式支持环境变量开关，并可分别限制 REST/MCP 到指定套餐。",
            },
            {
              icon: <Code2 className="size-4 text-violet-300" />,
              title: "服务端合流",
              text: "抖音等分离音视频场景会自动走服务端合并，避免无声文件。",
            },
          ].map((item) => (
            <div key={item.title} className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5">
              <div className="mb-3 flex items-center gap-2 text-sm font-medium text-white/80">
                {item.icon}
                {item.title}
              </div>
              <p className="text-sm leading-6 text-white/50">{item.text}</p>
            </div>
          ))}
        </motion.section>

        <div className="grid gap-8 xl:grid-cols-[1.05fr_0.95fr]">
          <motion.section
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.1 }}
            className="rounded-[24px] border border-white/[0.08] bg-white/[0.03] p-6"
          >
            <div className="mb-5 flex items-center gap-2">
              <Workflow className="size-4 text-violet-300" />
              <h2 className="text-lg font-semibold text-white">REST Endpoints</h2>
            </div>

            <div className="space-y-5">
              {restEndpoints.map((endpoint) => (
                <div key={endpoint.path} className="rounded-2xl border border-white/[0.07] bg-black/20 p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <span className="rounded-md bg-violet-500/20 px-2 py-1 text-xs font-semibold text-violet-300">
                      {endpoint.method}
                    </span>
                    <code className="text-sm text-white/75">{endpoint.path}</code>
                  </div>
                  <p className="mb-3 text-sm leading-6 text-white/50">{endpoint.description}</p>
                  <div className="rounded-xl border border-white/[0.06] bg-[#04060a] p-4 font-mono text-xs leading-6 text-white/55">
                    <div className="mb-2 text-white/35">JSON Body</div>
                    <pre className="overflow-x-auto whitespace-pre-wrap">{endpoint.body}</pre>
                  </div>
                </div>
              ))}
            </div>
          </motion.section>

          <div className="space-y-8">
            <motion.section
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.15 }}
              className="rounded-[24px] border border-white/[0.08] bg-white/[0.03] p-6"
            >
              <div className="mb-4 flex items-center gap-2">
                <KeyRound className="size-4 text-cyan-300" />
                <h2 className="text-lg font-semibold text-white">Authentication</h2>
              </div>
              <p className="mb-4 text-sm leading-6 text-white/52">
                浏览器站内流程继续支持 Session。第三方服务建议统一使用 Bearer API Key。若请求头里显式带了错误 Key，接口会直接返回 `401 Invalid API key`。
              </p>
              <div className="rounded-xl border border-white/[0.06] bg-[#04060a] p-4 font-mono text-xs leading-6 text-white/65">
                Authorization: Bearer CLIPVERSE_API_KEY
              </div>
              <p className="mt-3 text-xs leading-6 text-white/40">
                环境变量：
                <br />
                `ENABLE_DEVELOPER_MODE=true`
                <br />
                `DEVELOPER_REST_ALLOWED_PLANS=lifetime,team`
                <br />
                `DEVELOPER_MCP_ALLOWED_PLANS=lifetime,team`
              </p>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.2 }}
              className="rounded-[24px] border border-white/[0.08] bg-white/[0.03] p-6"
            >
              <div className="mb-4 flex items-center gap-2">
                <TerminalSquare className="size-4 text-emerald-300" />
                <h2 className="text-lg font-semibold text-white">cURL Example</h2>
              </div>
              <div className="rounded-xl border border-white/[0.06] bg-[#04060a] p-4 font-mono text-xs leading-6 text-white/62">
                <pre className="overflow-x-auto whitespace-pre-wrap">{curlExample.replaceAll("$ORIGIN", origin)}</pre>
              </div>
            </motion.section>
          </div>
        </div>

        <motion.section
          id="mcp"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.25 }}
          className="mt-8 rounded-[28px] border border-white/[0.08] bg-white/[0.03] p-6"
        >
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <Blocks className="size-4 text-cyan-300" />
                <h2 className="text-lg font-semibold text-white">MCP Endpoint</h2>
              </div>
              <p className="text-sm leading-6 text-white/52">
                ClipVerse 现已提供轻量 HTTP MCP 端点，适合 Agent、自动化编排平台和 AI 工作流直接调用。
              </p>
            </div>
            <code className="rounded-xl border border-white/[0.08] bg-black/30 px-3 py-2 text-xs text-cyan-300">
              {mcpEndpoint}
            </code>
          </div>

          <div className="mb-6 grid gap-4 lg:grid-cols-[0.65fr_0.35fr]">
            <div className="rounded-2xl border border-white/[0.06] bg-black/20 p-4">
              <div className="mb-2 text-sm font-medium text-white/75">可用工具</div>
              <div className="flex flex-wrap gap-2">
                {mcpTools.map((tool) => (
                  <code key={tool} className="rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1 text-xs text-white/70">
                    {tool}
                  </code>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-white/[0.06] bg-black/20 p-4 text-sm leading-6 text-white/52">
              鉴权方式：
              <br />
              `Authorization: Bearer CLIPVERSE_API_KEY`
              <br />
              支持 `initialize`、`tools/list`、`tools/call`
            </div>
          </div>

          <div className="mb-6 rounded-2xl border border-white/[0.06] bg-black/20 p-4 text-sm leading-6 text-white/52">
            发现入口：
            <br />
            <code className="text-cyan-300">{discoveryEndpoint}</code>
            <br />
            返回服务元数据、鉴权方式和工具清单，便于第三方自动发现。
          </div>

          <div className="grid gap-6 xl:grid-cols-2">
            <div className="rounded-2xl border border-white/[0.06] bg-[#04060a] p-4">
              <div className="mb-3 text-sm font-medium text-white/75">1. initialize</div>
              <pre className="overflow-x-auto whitespace-pre-wrap font-mono text-xs leading-6 text-white/62">
                {mcpInitialize}
              </pre>
            </div>
            <div className="rounded-2xl border border-white/[0.06] bg-[#04060a] p-4">
              <div className="mb-3 text-sm font-medium text-white/75">2. tools/call</div>
              <pre className="overflow-x-auto whitespace-pre-wrap font-mono text-xs leading-6 text-white/62">
                {mcpCall}
              </pre>
            </div>
          </div>

          <div className="mt-6 grid gap-6 xl:grid-cols-2">
            <div className="rounded-2xl border border-white/[0.06] bg-[#04060a] p-4">
              <div className="mb-3 text-sm font-medium text-white/75">3. 客户端配置示例</div>
              <pre className="overflow-x-auto whitespace-pre-wrap font-mono text-xs leading-6 text-white/62">
                {claudeConfig.replaceAll("$ORIGIN", origin)}
              </pre>
            </div>
            <div className="rounded-2xl border border-white/[0.06] bg-[#04060a] p-4">
              <div className="mb-3 text-sm font-medium text-white/75">4. 发现端点</div>
              <pre className="overflow-x-auto whitespace-pre-wrap font-mono text-xs leading-6 text-white/62">
                {openApiLikeDiscovery.replaceAll("$ORIGIN", origin)}
              </pre>
            </div>
          </div>

          <div className="mt-6 grid gap-6 xl:grid-cols-2">
            <div className="rounded-2xl border border-white/[0.06] bg-[#04060a] p-4">
              <div className="mb-3 text-sm font-medium text-white/75">5. OpenAPI 导出</div>
              <pre className="overflow-x-auto whitespace-pre-wrap font-mono text-xs leading-6 text-white/62">
                {openApiSpec.replaceAll("$ORIGIN", origin)}
              </pre>
            </div>
            <div className="rounded-2xl border border-white/[0.06] bg-[#04060a] p-4">
              <div className="mb-3 text-sm font-medium text-white/75">6. 仓库模板</div>
              <pre className="overflow-x-auto whitespace-pre-wrap font-mono text-xs leading-6 text-white/62">
                {repoTemplate}
              </pre>
            </div>
          </div>
        </motion.section>
      </main>
    </div>
  );
}
