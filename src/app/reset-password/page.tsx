"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Lock, Loader2, CheckCircle, AlertCircle, Eye, EyeOff } from "lucide-react";
import { Navbar } from "@/components/navbar";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token") ?? "";
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) { setError("Passwords do not match"); return; }
    if (password.length < 8) { setError("Password must be at least 8 characters"); return; }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (data.success) {
        setDone(true);
        setTimeout(() => router.push("/login"), 3000);
      } else {
        setError(data.error || "Something went wrong");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (!token) {
    return (
      <div className="text-center">
        <AlertCircle className="mx-auto mb-3 size-10 text-red-400" />
        <h1 className="mb-2 text-xl font-bold text-white">Invalid link</h1>
        <p className="text-sm text-white/50">This password reset link is invalid or has expired.</p>
        <a href="/forgot-password" className="mt-4 inline-block text-sm text-violet-400 hover:text-violet-300">Request a new one →</a>
      </div>
    );
  }

  return done ? (
    <div className="text-center">
      <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-emerald-500/10">
        <CheckCircle className="size-7 text-emerald-400" />
      </div>
      <h1 className="mb-2 text-xl font-bold text-white">Password reset!</h1>
      <p className="text-sm text-white/50">Your password has been updated. Redirecting to login…</p>
    </div>
  ) : (
    <>
      <div className="mb-6">
        <h1 className="mb-1 text-xl font-bold text-white">Set new password</h1>
        <p className="text-sm text-white/50">Choose a strong password for your account.</p>
      </div>

      {error && (
        <div className="mb-4 flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2.5 text-sm text-red-400">
          <AlertCircle className="size-4 shrink-0" />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="rp-pw" className="mb-1.5 block text-xs font-medium text-white/60">New password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-white/25" />
            <input
              id="rp-pw"
              type={showPw ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              placeholder="Min. 8 characters"
              className="w-full rounded-lg border border-white/[0.08] bg-white/[0.03] py-2.5 pl-10 pr-10 text-sm text-white outline-none placeholder:text-white/25 focus:border-violet-500/50"
            />
            <button type="button" onClick={() => setShowPw((p) => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/50">
              {showPw ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
        </div>
        <div>
          <label htmlFor="rp-confirm" className="mb-1.5 block text-xs font-medium text-white/60">Confirm password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-white/25" />
            <input
              id="rp-confirm"
              type={showPw ? "text" : "password"}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              placeholder="Repeat password"
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
          Reset password
        </button>
      </form>
    </>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="relative min-h-screen">
      <Navbar />
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-[20%] h-[500px] w-[600px] -translate-x-1/2 bg-[radial-gradient(ellipse,rgba(124,58,237,0.1)_0%,transparent_70%)]" />
      </div>
      <main className="relative z-10 flex min-h-screen items-center justify-center px-6 pt-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-md">
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8">
            <Suspense fallback={<Loader2 className="size-5 animate-spin text-violet-400" />}>
              <ResetPasswordForm />
            </Suspense>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
