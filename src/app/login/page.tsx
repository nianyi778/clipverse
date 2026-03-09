"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { motion } from "framer-motion";
import { Mail, Lock, User, ArrowRight, Loader2 } from "lucide-react";
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
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (searchParams.get("mode") === "register") setMode("register");
    if (searchParams.get("error")) setError("Authentication failed. Please try again.");
  }, [searchParams]);

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (mode === "register") {
        const res = await fetch("/api/user/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, name: name || undefined }),
        });
        const data = await res.json();
        if (!data.success) {
          setError(data.error || "Registration failed");
          setLoading(false);
          return;
        }
      }

      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(mode === "register" ? "Account created but login failed. Try logging in." : "Invalid email or password");
        setLoading(false);
        return;
      }

      router.push("/download");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    await signIn("google", { callbackUrl: "/download" });
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
              onClick={handleGoogleSignIn}
              disabled={googleLoading || loading}
              className="flex w-full cursor-pointer items-center justify-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3.5 text-sm font-medium text-white/80 transition-all hover:border-white/[0.15] hover:bg-white/[0.06] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {googleLoading ? (
                <Loader2 className="size-5 animate-spin" />
              ) : (
                <svg className="size-5" viewBox="0 0 24 24" role="img" aria-hidden="true">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
              )}
              Continue with Google
            </button>
          </motion.div>

          <motion.div variants={fadeInUp} transition={{ duration: 0.4 }} className="my-6 flex items-center gap-4">
            <div className="h-px flex-1 bg-white/[0.06]" />
            <span className="text-xs text-white/25">or</span>
            <div className="h-px flex-1 bg-white/[0.06]" />
          </motion.div>

          {error && (
            <motion.p
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-2.5 text-center text-sm text-red-400"
            >
              {error}
            </motion.p>
          )}

          <motion.form variants={fadeInUp} transition={{ duration: 0.5 }} onSubmit={handleCredentialsSubmit} className="space-y-4">
            {mode === "register" && (
              <div className="relative">
                <User className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-white/25" />
                <input
                  type="text"
                  placeholder="Name (optional)"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={loading}
                  className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3.5 pl-11 text-sm text-white outline-none transition-colors placeholder:text-white/20 focus:border-violet-500/40 disabled:opacity-50"
                />
              </div>
            )}

            <div className="relative">
              <Mail className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-white/25" />
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3.5 pl-11 text-sm text-white outline-none transition-colors placeholder:text-white/20 focus:border-violet-500/40 disabled:opacity-50"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-white/25" />
              <input
                type="password"
                placeholder={mode === "register" ? "Password (min 8 chars)" : "Password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={mode === "register" ? 8 : undefined}
                disabled={loading}
                className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3.5 pl-11 text-sm text-white outline-none transition-colors placeholder:text-white/20 focus:border-violet-500/40 disabled:opacity-50"
              />
            </div>

            <button
              type="submit"
              disabled={loading || googleLoading}
              className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 py-3.5 text-sm font-semibold text-white transition-all hover:from-violet-500 hover:to-purple-500 hover:shadow-[0_0_24px_rgba(124,58,237,0.3)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  {mode === "register" ? "Creating account..." : "Logging in..."}
                </>
              ) : (
                <>
                  {mode === "login" ? "Log in" : "Create account"}
                  <ArrowRight className="size-4" />
                </>
              )}
            </button>
          </motion.form>

          <motion.p variants={fadeInUp} transition={{ duration: 0.4 }} className="mt-6 text-center text-sm text-white/30">
            {mode === "login" ? (
              <>
                Don&apos;t have an account?{" "}
                <button
                  type="button"
                  onClick={() => { setMode("register"); setError(""); }}
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
                  onClick={() => { setMode("login"); setError(""); }}
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
