FROM node:22-slim AS builder

WORKDIR /app
COPY package.json ./
RUN corepack enable pnpm && pnpm install

COPY . .
RUN npx tsx --version > /dev/null

FROM node:22-slim

RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 python3-pip python3-venv \
    ffmpeg curl unzip ca-certificates \
    && rm -rf /var/lib/apt/lists/*

RUN curl -fsSL https://deno.land/install.sh | sh
ENV DENO_DIR="/root/.deno"
ENV PATH="${DENO_DIR}/bin:${PATH}"

RUN pip3 install --break-system-packages --no-cache-dir --upgrade \
    yt-dlp \
    bgutil-ytdlp-pot-provider \
    curl_cffi

RUN mkdir -p /cookies && chmod 755 /cookies

WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/src ./src
COPY --from=builder /app/tsconfig.json ./
COPY --from=builder /app/yt_dlp_plugins ./yt_dlp_plugins

ARG BUILD_TIME=unknown
ARG BUILD_SHA=unknown
ENV BUILD_TIME=$BUILD_TIME
ENV BUILD_SHA=$BUILD_SHA
ENV PYTHONPATH=/app
ENV PORT=8787
EXPOSE 8787

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:8787/health || exit 1

CMD ["node", "--import", "tsx", "src/index.ts"]
