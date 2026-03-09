"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, MessageSquare, Send } from "lucide-react";
import { Navbar } from "@/components/navbar";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="relative min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-3xl px-6 pb-24 pt-32">
        <motion.div
          className="mb-12 text-center"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="mb-3 text-3xl font-bold text-white">Contact Us</h1>
          <p className="text-white/40">Have a question? We'd love to hear from you.</p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-6"
          >
            <div className="flex gap-4">
              <Mail className="size-5 shrink-0 text-violet-400" />
              <div>
                <h3 className="font-semibold text-white">Email</h3>
                <p className="text-sm text-white/50">support@clipverse.app</p>
              </div>
            </div>

            <div className="flex gap-4">
              <MessageSquare className="size-5 shrink-0 text-violet-400" />
              <div>
                <h3 className="font-semibold text-white">Telegram</h3>
                <a
                  href="https://t.me/clipverse"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-violet-400 transition-colors hover:text-violet-300"
                >
                  @clipverse
                </a>
              </div>
            </div>
          </motion.div>

          <motion.form
            onSubmit={handleSubmit}
            className="space-y-4"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div>
              <input
                type="text"
                name="name"
                placeholder="Your name"
                value={formData.name}
                onChange={handleChange}
                className="w-full rounded-lg border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-white/20 focus:border-violet-500/40"
              />
            </div>

            <div>
              <input
                type="email"
                name="email"
                placeholder="Your email"
                value={formData.email}
                onChange={handleChange}
                className="w-full rounded-lg border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-white/20 focus:border-violet-500/40"
              />
            </div>

            <div>
              <textarea
                name="message"
                placeholder="Your message"
                value={formData.message}
                onChange={handleChange}
                rows={4}
                className="w-full rounded-lg border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-white/20 focus:border-violet-500/40"
              />
            </div>

            <button
              type="submit"
              className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-violet-600 to-purple-600 py-3 text-sm font-semibold text-white transition-all hover:from-violet-500 hover:to-purple-500 hover:shadow-[0_0_24px_rgba(124,58,237,0.3)]"
            >
              Send Message
              <Send className="size-4" />
            </button>
          </motion.form>
        </div>
      </main>
    </div>
  );
}
