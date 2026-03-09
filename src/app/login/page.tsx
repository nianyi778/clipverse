"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, Lock, ArrowRight, Chrome, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Navbar } from "@/components/navbar";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
};

type AuthMode = "login" | "register";

function LoginPageContent() {
  const searchParams = useSearchParams();
  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const modeParam = searchParams.get("mode");
    if (modeParam === "register") {
      setMode("register");
    }
  }, [searchParams]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="relative min-h-screen">
      <Navbar />

      <section className="flex min-h-screen items-center justify-center px-6 pt-20">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-1/2 top-[30%] h-[500px] w-[600px] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(ellipse,rgba(124,58,237,0.1)_0%,transparent_70%)]" />
        </div>

        <motion.div
          className="relative z-10 w-full max-w-md"
          initial="hidden"
          animate="visible"
          variants={stagger}
        >
          <motion.div variants={fadeInUp} transition={{ duration: 0.5 }} className="mb-8 text-center">
            <h1 className="mb-2 text-3xl font-bold text-white">
              {mode === "login" ? "Welcome back" : "Create account"}
            </h1>
            <p className="text-white/40">
              {mode === "login"
                ? "Log in to access your downloads"
                : "Start downloading videos for free"}
            </p>
          </motion.div>

          <motion.div variants={fadeInUp} transition={{ duration: 0.5 }}>
            <button
              type="button"
              className="flex w-full cursor-pointer items-center justify-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3.5 text-sm font-medium text-white/80 transition-all hover:border-white/[0.15] hover:bg-white/[0.06]"
            >
              <Chrome className="size-5" />
              Continue with Google
            </button>
          </motion.div>

          <motion.div variants={fadeInUp} transition={{ duration: 0.4 }} className="my-6 flex items-center gap-4">
            <div className="h-px flex-1 bg-white/[0.06]" />
            <span className="text-xs text-white/25">or</span>
            <div className="h-px flex-1 bg-white/[0.06]" />
          </motion.div>

          <motion.form variants={fadeInUp} transition={{ duration: 0.5 }} onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-white/25" />
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3.5 pl-11 text-sm text-white outline-none transition-colors placeholder:text-white/20 focus:border-violet-500/40"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-white/25" />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3.5 pl-11 text-sm text-white outline-none transition-colors placeholder:text-white/20 focus:border-violet-500/40"
              />
            </div>

            <button
              type="submit"
              className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 py-3.5 text-sm font-semibold text-white transition-all hover:from-violet-500 hover:to-purple-500 hover:shadow-[0_0_24px_rgba(124,58,237,0.3)]"
            >
              {mode === "login" ? "Log in" : "Create account"}
              <ArrowRight className="size-4" />
            </button>
          </motion.form>

          <motion.p variants={fadeInUp} transition={{ duration: 0.4 }} className="mt-6 text-center text-sm text-white/30">
            {mode === "login" ? (
              <>
                Don&apos;t have an account?{" "}
                <button
                  type="button"
                  onClick={() => setMode("register")}
                  className={cn("cursor-pointer text-violet-400 transition-colors hover:text-violet-300")}
                >
                  Sign up
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => setMode("login")}
                  className={cn("cursor-pointer text-violet-400 transition-colors hover:text-violet-300")}
                >
                  Log in
                </button>
              </>
            )}
          </motion.p>
        </motion.div>
      </section>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="relative min-h-screen">
          <Navbar />
          <div className="flex items-center justify-center pt-40">
            <Loader2 className="size-6 animate-spin text-violet-400" />
          </div>
        </div>
      }
    >
      <LoginPageContent />
    </Suspense>
  );
}
