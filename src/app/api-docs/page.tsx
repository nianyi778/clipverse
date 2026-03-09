"use client";

import { motion } from "framer-motion";
import { Navbar } from "@/components/navbar";

export default function APIDocsPage() {
  return (
    <div className="relative min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-3xl px-6 pb-24 pt-32">
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="mb-3 text-3xl font-bold text-white">API Documentation</h1>
          <p className="text-white/40">Integrate ClipVerse into your application</p>
        </motion.div>

        <div className="space-y-8">
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h2 className="mb-4 text-lg font-semibold text-white/80">Endpoints</h2>

            <div className="space-y-6">
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <span className="rounded bg-violet-600/30 px-2 py-1 text-xs font-semibold text-violet-300">
                    POST
                  </span>
                  <code className="text-sm text-white/60">/api/parse</code>
                </div>
                <p className="mb-3 text-sm text-white/50">Parse a video URL and extract metadata</p>
                <div className="rounded-lg bg-white/[0.03] p-4 font-mono text-xs text-white/40">
                  <div>
                    <span className="text-white/60">Request:</span>
                  </div>
                  <div className="mt-2 text-white/50">
                    {`{
  "url": "https://youtube.com/watch?v=..."
}`}
                  </div>
                  <div className="mt-3">
                    <span className="text-white/60">Response:</span>
                  </div>
                  <div className="mt-2 text-white/50">
                    {`{
  "success": true,
  "data": {
    "title": "Video Title",
    "duration": 3600,
    "formats": ["1080p", "720p", "480p"]
  }
}`}
                  </div>
                </div>
              </div>

              <div>
                <div className="mb-2 flex items-center gap-2">
                  <span className="rounded bg-violet-600/30 px-2 py-1 text-xs font-semibold text-violet-300">
                    POST
                  </span>
                  <code className="text-sm text-white/60">/api/download</code>
                </div>
                <p className="mb-3 text-sm text-white/50">Get download URL for a video</p>
                <div className="rounded-lg bg-white/[0.03] p-4 font-mono text-xs text-white/40">
                  <div>
                    <span className="text-white/60">Request:</span>
                  </div>
                  <div className="mt-2 text-white/50">
                    {`{
  "url": "https://youtube.com/watch?v=...",
  "format": "1080p"
}`}
                  </div>
                  <div className="mt-3">
                    <span className="text-white/60">Response:</span>
                  </div>
                  <div className="mt-2 text-white/50">
                    {`{
  "success": true,
  "downloadUrl": "https://..."
}`}
                  </div>
                </div>
              </div>

              <div>
                <div className="mb-2 flex items-center gap-2">
                  <span className="rounded bg-violet-600/30 px-2 py-1 text-xs font-semibold text-violet-300">
                    POST
                  </span>
                  <code className="text-sm text-white/60">/api/subtitles</code>
                </div>
                <p className="mb-3 text-sm text-white/50">Get subtitles for a video (Pro only)</p>
                <div className="rounded-lg bg-white/[0.03] p-4 font-mono text-xs text-white/40">
                  <div>
                    <span className="text-white/60">Request:</span>
                  </div>
                  <div className="mt-2 text-white/50">
                    {`{
  "url": "https://youtube.com/watch?v=...",
  "language": "en"
}`}
                  </div>
                </div>
              </div>

              <div>
                <div className="mb-2 flex items-center gap-2">
                  <span className="rounded bg-violet-600/30 px-2 py-1 text-xs font-semibold text-violet-300">
                    POST
                  </span>
                  <code className="text-sm text-white/60">/api/batch</code>
                </div>
                <p className="mb-3 text-sm text-white/50">Batch parse multiple URLs (Pro only)</p>
                <div className="rounded-lg bg-white/[0.03] p-4 font-mono text-xs text-white/40">
                  <div>
                    <span className="text-white/60">Request:</span>
                  </div>
                  <div className="mt-2 text-white/50">
                    {`{
  "urls": ["https://...", "https://..."]
}`}
                  </div>
                </div>
              </div>
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="mb-4 text-lg font-semibold text-white/80">Authentication</h2>
            <p className="text-sm text-white/50">
              Include your API key in the Authorization header: <code className="text-white/60">Authorization: Bearer YOUR_API_KEY</code>
            </p>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h2 className="mb-4 text-lg font-semibold text-white/80">Rate Limits</h2>
            <p className="text-sm text-white/50">
              Free tier: 100 requests/day. Pro tier: 10,000 requests/day. Lifetime: Unlimited.
            </p>
          </motion.section>
        </div>
      </main>
    </div>
  );
}
