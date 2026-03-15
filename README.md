# ClipVerse

**Universal Video Downloader** — download from YouTube, Bilibili, TikTok, Vimeo, and more. Self-hosted yt-dlp backend, Next.js frontend on Vercel, Stripe billing, and a Chrome extension for one-click downloads.

> GitHub: [https://github.com/nianyi778/clipverse](https://github.com/nianyi778/clipverse)

---

## Features

- **Multi-platform support** — YouTube, Bilibili, TikTok, Vimeo, and any site yt-dlp supports
- **Quality selection** — choose resolution and format before downloading
- **Subtitle extraction** — download subtitles alongside video
- **Batch download** — queue multiple URLs at once
- **Chrome extension** — one-click download button injected on supported sites
- **User accounts** — Google OAuth and email/password via Auth.js
- **Subscription plans** — Free, Pro, Lifetime, and Team tiers via Stripe
- **API keys** — programmatic access for Pro+ users
- **Developer mode** — REST API, MCP endpoint, discovery document, and OpenAPI export
- **Per-platform proxy support** — configure separate proxies for TikTok, Bilibili, Douyin, etc.
- **Cookie-based auth** — mount cookie files for platforms that require login

---

## Architecture

```
                        ┌─────────────────────────────────────┐
                        │           Vercel (Frontend)          │
                        │         Next.js 16 App Router        │
                        └──────────────┬──────────────────────┘
                                       │ API routes proxy requests
                                       │
                        ┌──────────────▼──────────────────────┐
                        │       Home Server (Self-hosted)      │
                        │                                      │
                        │  ┌─────────────────────────────┐    │
                        │  │   ytdlp-service (Hono)      │    │
                        │  │   port 8787                 │    │
                        │  └──────────┬──────────────────┘    │
                        │             │                        │
                        │  ┌──────────▼──────────────────┐    │
                        │  │   bgutil-provider            │    │
                        │  │   (YouTube PO Token)        │    │
                        │  └─────────────────────────────┘    │
                        └──────────────┬──────────────────────┘
                                       │
                        ┌──────────────▼──────────────────────┐
                        │       Cloudflare Tunnel              │
                        │  (exposes home server to Vercel)     │
                        └─────────────────────────────────────┘

                        ┌─────────────────────────────────────┐
                        │       TiDB Serverless (MySQL)        │
                        │  users, downloads, subscriptions,    │
                        │  api_keys tables                     │
                        └─────────────────────────────────────┘
```

The frontend never calls yt-dlp directly. All download requests go through Next.js API routes, which forward to the self-hosted `ytdlp-service` over a Cloudflare Tunnel. The tunnel URL is set via `YTDLP_SERVICE_URL`.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend framework | Next.js 16 (App Router) |
| Styling | Tailwind CSS v4 |
| UI components | shadcn/ui + Base UI |
| Animations | framer-motion |
| Auth | Auth.js (NextAuth v5) — Google OAuth + Credentials |
| Payments | Stripe |
| ORM | drizzle-orm |
| Database driver | mysql2 |
| Database | TiDB Serverless (MySQL-compatible) |
| Backend service | Hono on Node.js |
| Download engine | yt-dlp + ffmpeg |
| Browser extension | Chrome MV3 |
| Containerization | Docker + Docker Compose |
| CI/CD | GitHub Actions |
| Frontend hosting | Vercel |

---

## Supported Platforms

| Platform | Status | Notes |
|---|---|---|
| YouTube | ✅ Working | Requires bgutil PO token provider for some videos |
| Bilibili | ✅ Working | Cookie file recommended for higher quality |
| Vimeo | ✅ Working | |
| TikTok | ✅ Working | Cookie file recommended |
| Instagram | ❌ Needs cookies | Mount `COOKIES_FILE` with valid session |
| Twitter / X | ❌ Needs cookies | Mount `COOKIES_FILE` with valid session |
| Facebook | ❌ yt-dlp bug | Upstream issue, not yet resolved |
| Douyin | ❌ Needs cookies | Cookie file required |
| Xiaohongshu | ❌ yt-dlp bug | Upstream issue, not yet resolved |

---

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm
- yt-dlp (`brew install yt-dlp` or `pip install yt-dlp`)
- ffmpeg (`brew install ffmpeg`)

### 1. Clone and install

```bash
git clone https://github.com/nianyi778/clipverse.git
cd clipverse
pnpm install
cd ytdlp-service && pnpm install && cd ..
```

### 2. Configure environment variables

Copy the example file and fill in your values:

```bash
cp .env.example .env.local
```

| Variable | Description |
|---|---|
| `DATABASE_URL` | TiDB / MySQL connection string |
| `AUTH_SECRET` | Random secret for Auth.js session signing |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret |
| `YTDLP_SERVICE_URL` | Internal URL of the yt-dlp service (server-side) |
| `YTDLP_API_KEY` | Shared secret between Next.js and ytdlp-service |
| `ENABLE_DEVELOPER_MODE` | Enable developer-facing API and MCP integrations |
| `DEVELOPER_REST_ALLOWED_PLANS` | Comma-separated plans allowed to use REST with API keys |
| `DEVELOPER_MCP_ALLOWED_PLANS` | Comma-separated plans allowed to use MCP |
| `NEXT_PUBLIC_YTDLP_PROXY_URL` | Public-facing proxy URL for the yt-dlp service |
| `STRIPE_SECRET_KEY` | Stripe secret key |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key |
| `STRIPE_PRO_PRICE_ID` | Stripe price ID for Pro plan |
| `STRIPE_LIFETIME_PRICE_ID` | Stripe price ID for Lifetime plan |
| `STRIPE_TEAM_PRICE_ID` | Stripe price ID for Team plan |
| `PROXY_URL` | Default proxy for yt-dlp (optional) |
| `TIKTOK_PROXY` | TikTok-specific proxy (optional) |
| `BILIBILI_PROXY` | Bilibili-specific proxy (optional) |
| `DOUYIN_PROXY` | Douyin-specific proxy (optional) |
| `XIAOHONGSHU_PROXY` | Xiaohongshu-specific proxy (optional) |
| `BGUTIL_POT_URL` | URL of the bgutil PO token provider (optional) |
| `YOUTUBE_COOKIES_FILE` | Path to YouTube cookies file (optional) |
| `TIKTOK_COOKIES_FILE` | Path to TikTok cookies file (optional) |
| `BILIBILI_COOKIES_FILE` | Path to Bilibili cookies file (optional) |
| `COOKIES_FILE` | Generic cookies file for other platforms (optional) |

### 3. Set up the database

```bash
pnpm tsx scripts/create-tables.ts
```

Or use drizzle-kit to push the schema:

```bash
pnpm db:push
```

### 4. Run in development

Start the frontend (port 3456 by default):

```bash
pnpm dev
```

Start the yt-dlp service (port 8787):

```bash
cd ytdlp-service
pnpm dev
```

### Developer integration

- REST docs: `/api-docs`
- OpenAPI spec: `/openapi.json`
- MCP discovery: `/.well-known/mcp`
- MCP endpoint: `/api/mcp`
- Example MCP config: `templates/mcp/clipverse.mcp.json`

---

## Docker Deployment

The yt-dlp service is designed to run on a home server or any Linux machine. The frontend deploys to Vercel separately.

### Pull and run with Docker Compose

```bash
docker compose up -d
```

The `docker-compose.yml` starts two containers:

- **ytdlp-service** — the Hono API that wraps yt-dlp, exposed on port `8787`
- **bgutil-provider** — provides YouTube PO tokens to bypass bot detection

### Cookie files

Place cookie files in the `secrets/` directory before starting:

```
secrets/
  youtube-cookies.txt
  tiktok-cookies.txt
  bilibili-cookies.txt
```

The compose file mounts `./secrets` as read-only into the container.

### Environment variables for Docker

Create a `.env` file next to `docker-compose.yml`:

```env
YTDLP_API_KEY=your-shared-secret
PROXY_URL=
TIKTOK_PROXY=
BILIBILI_PROXY=
DOUYIN_PROXY=
XIAOHONGSHU_PROXY=
```

### Expose via Cloudflare Tunnel

After the service is running locally, create a Cloudflare Tunnel to expose port `8787`:

```bash
cloudflared tunnel --url http://localhost:8787
```

Set the resulting tunnel URL as `YTDLP_SERVICE_URL` in your Vercel environment variables.

---

## CI/CD

GitHub Actions builds and pushes the `ytdlp-service` Docker image to GHCR on every push to `main` that touches `ytdlp-service/` or the workflow file itself.

**Workflow:** `.github/workflows/build-ytdlp-service.yml`

- Builds for `linux/amd64` and `linux/arm64`
- Tags the image as `latest` and with the commit SHA
- Pushes to `ghcr.io/nianyi778/clipverse-ytdlp`

To pull the latest image manually:

```bash
docker pull ghcr.io/nianyi778/clipverse-ytdlp:latest
```

---

## Project Structure

```
clipverse/
├── src/
│   ├── app/              # Next.js App Router pages and API routes
│   ├── components/       # React components
│   ├── db/
│   │   └── schema.ts     # Drizzle ORM schema (users, downloads, subscriptions, api_keys)
│   ├── lib/              # Shared utilities and server actions
│   └── types/            # TypeScript type definitions
├── ytdlp-service/
│   └── src/              # Hono server — wraps yt-dlp CLI
├── extension/            # Chrome MV3 extension
│   ├── manifest.json
│   ├── background.js
│   ├── content/
│   └── popup/
├── scripts/
│   └── create-tables.ts  # One-time DB table creation script
├── secrets/              # Cookie files (gitignored)
├── docker-compose.yml
└── .env.local            # Local environment variables (gitignored)
```

---

## Database Schema

Four tables managed by drizzle-orm:

- **users** — accounts with plan tier (`free`, `pro`, `lifetime`, `team`), Stripe customer ID, and daily download counter
- **downloads** — download history per user with platform, format, quality, and status tracking
- **subscriptions** — Stripe subscription records with lifecycle status
- **api_keys** — named API keys for programmatic access with usage counters

---

## License

Private. All rights reserved.
