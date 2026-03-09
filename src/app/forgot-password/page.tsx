"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, ArrowLeft, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { Navbar } from "@/components/navbar";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.success) {
        setSent(true);
      } else {
        setError(data.error || "Something went wrong");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen">
      <Navbar />
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-[20%] h-[500px] w-[600px] -translate-x-1/2 bg-[radial-gradient(ellipse,rgba(124,58,237,0.1)_0%,transparent_70%)]" />
      </div>

      <main className="relative z-10 flex min-h-screen items-center justify-center px-6 pt-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8">
            {sent ? (
              <div className="text-center">
                <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-emerald-500/10">
                  <CheckCircle className="size-7 text-emerald-400" />
                </div>
                <h1 className="mb-2 text-xl font-bold text-white">Check your email</h1>
                <p className="text-sm text-white/50">
                  If an account exists for <span className="text-white/70">{email}</span>, we&apos;ve sent a password reset link. Check your inbox and spam folder.
                </p>
                <a
                  href="/login"
                  className="mt-6 inline-flex items-center gap-1.5 text-sm text-violet-400 hover:text-violet-300"
                >
                  <ArrowLeft className="size-3.5" />
                  Back to login
                </a>
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <h1 className="mb-1 text-xl font-bold text-white">Forgot password?</h1>
                  <p className="text-sm text-white/50">Enter your email and we&apos;ll send you a reset link.</p>
                </div>

                {error && (
                  <div className="mb-4 flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2.5 text-sm text-red-400">
                    <AlertCircle className="size-4 shrink-0" />
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="fp-email" className="mb-1.5 block text-xs font-medium text-white/60">Email address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-white/25" />
                      <input
                        id="fp-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="you@example.com"
                        className="w-full rounded-lg border border-white/[0.08] bg-white/[0.03] py-2.5 pl-10 pr-4 text-sm text-white outline-none placeholder:text-white/25 focus:border-violet-500/50"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-violet-600 to-purple-600 py-2.5 text-sm font-semibold text-white transition-all hover:from-violet-500 hover:to-purple-500 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading && <Loader2 className="size-4 animate-spin" />}
                    Send reset link
                  </button>
                </form>

                <a
                  href="/login"
                  className="mt-5 flex items-center justify-center gap-1.5 text-sm text-white/40 hover:text-white/60"
                >
                  <ArrowLeft className="size-3.5" />
                  Back to login
                </a>
              </>
            )}
          </div>
        </motion.div>
      </main>
    </div>
  );
}
