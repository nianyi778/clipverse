"use client";

import { motion } from "framer-motion";
import { Navbar } from "@/components/navbar";

export default function BlogPage() {
  return (
    <div className="relative min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-3xl px-6 pb-24 pt-32">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="mb-4 text-3xl font-bold text-white">Blog</h1>
          <p className="text-white/40">Coming soon. Follow us on Telegram for updates.</p>
        </motion.div>
      </main>
    </div>
  );
}
