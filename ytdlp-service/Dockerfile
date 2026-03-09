FROM node:22-slim

RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    python3-venv \
    ffmpeg \
    curl \
    unzip \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

RUN curl -fsSL https://deno.land/install.sh | sh
ENV DENO_DIR="/root/.deno"
ENV PATH="${DENO_DIR}/bin:${PATH}"

RUN pip3 install --break-system-packages yt-dlp bgutil-ytdlp-pot-provider

WORKDIR /app
COPY package.json ./
RUN corepack enable pnpm && pnpm install --prod

COPY . .

ENV PORT=8787
EXPOSE 8787

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:8787/health || exit 1

CMD ["node", "--import", "tsx", "src/index.ts"]
