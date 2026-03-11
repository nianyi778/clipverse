"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { motion } from "framer-motion";
import {
  Mail,
  Lock,
  User,
  ArrowRight,
  Loader2,
  Eye,
  EyeOff,
  Download,
  Zap,
  Users,
  Shield,
  Sparkles,
  Play,
} from "lucide-react";
import { cn } from "@/lib/utils";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
};

type AuthMode = "login" | "register";

const valueProps = [
  { icon: Play, title: "YouTube 4K & 8K", desc: "Download in highest quality available" },
  { icon: Shield, title: "TikTok No Watermark", desc: "Clean downloads without branding" },
  { icon: Download, title: "Batch Download", desc: "Queue multiple videos at once" },
  { icon: Zap, title: "Lightning Fast", desc: "Optimized servers for maximum speed" },
  { icon: Sparkles, title: "50+ Platforms", desc: "YouTube, TikTok, Instagram, Twitter & more" },
  { icon: Users, title: "200K+ Users", desc: "Trusted by creators worldwide" },
];

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
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (searchParams.get("mode") === "register") setMode("register");
    if (searchParams.get("error")) {
      setError("Authentication failed. Please try again.");
      setGoogleLoading(false);
    }
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
    setError("");
    try {
      await signIn("google", { callbackUrl: "/download" });
    } catch {
      setGoogleLoading(false);
      setError("Google sign-in failed. Please try again.");
    }
  };

  return (
    <div className="relative min-h-screen lg:grid lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-gradient-to-br from-violet-950/50 via-slate-950 to-slate-950 lg:flex lg:flex-col lg:justify-between lg:p-12">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
        <div className="pointer-events-none absolute -top-24 left-1/2 h-[500px] w-[600px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(124,58,237,0.15)_0%,transparent_70%)]" />
        <div className="pointer-events-none absolute -bottom-32 -left-32 h-[400px] w-[400px] rounded-full bg-[radial-gradient(ellipse,rgba(139,92,246,0.08)_0%,transparent_70%)]" />

        <div className="relative z-10">
          <a href="/" className="group inline-flex items-center gap-2.5">
            <svg
              viewBox="0 0 36 36"
              className="size-9 shrink-0"
              role="img"
              aria-hidden="true"
              style={{ filter: "drop-shadow(0 4px 12px rgba(124, 58, 237, 0.4))" }}
            >
              <defs>
                <linearGradient id="cv-l-bg" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#8b5cf6" />
                  <stop offset="50%" stopColor="#7c3aed" />
                  <stop offset="100%" stopColor="#6d28d9" />
                </linearGradient>
                <linearGradient id="cv-l-shine" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#fff" stopOpacity="0.25" />
                  <stop offset="50%" stopColor="#fff" stopOpacity="0.05" />
                  <stop offset="100%" stopColor="#fff" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="cv-l-play" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="100%" stopColor="#e9d5ff" />
                </linearGradient>
              </defs>
              <rect x="2" y="2" width="32" height="32" rx="8" fill="#4c1d95" />
              <rect x="1" y="1" width="32" height="32" rx="8" fill="url(#cv-l-bg)" />
              <rect x="1" y="1" width="32" height="16" rx="8" fill="url(#cv-l-shine)" />
              <path d="M14 11.5L24 18L14 24.5V11.5Z" fill="url(#cv-l-play)" />
              <path d="M14 11.5L14 24.5L24 18L14 11.5Z" fill="#fff" fillOpacity="0.15" style={{ transform: "translateX(-1px)" }} />
            </svg>
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-violet-400 to-purple-500 bg-clip-text text-transparent">
              ClipVerse
            </span>
          </a>
        </div>

        <div className="relative z-10 -mt-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-2 text-4xl font-bold leading-tight text-white"
          >
            The fastest way to
            <br />
            <span className="bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
              download videos
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-10 max-w-sm text-white/40"
          >
            Save videos from any platform in seconds. No watermarks, highest quality, completely free.
          </motion.p>

          <div className="space-y-4">
            {valueProps.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.3 + i * 0.07 }}
                className="flex items-start gap-3"
              >
                <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-violet-500/10 text-violet-400">
                  <item.icon className="size-4" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white/90">{item.title}</p>
                  <p className="text-xs text-white/35">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="relative z-10"
        >
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              {["A", "K", "M", "J"].map((letter) => (
                <div
                  key={letter}
                  className="flex size-7 items-center justify-center rounded-full border-2 border-slate-950 bg-gradient-to-br from-violet-500 to-purple-600 text-[10px] font-bold text-white"
                >
                  {letter}
                </div>
              ))}
            </div>
            <div>
              <p className="text-sm font-medium text-white/70">200,000+ users</p>
              <p className="text-xs text-white/30">Trusted worldwide</p>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="relative flex min-h-screen flex-col bg-[#0a0a0f] px-6 py-8 lg:min-h-0 lg:justify-center lg:px-16">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-1/2 top-[30%] h-[500px] w-[600px] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(ellipse,rgba(124,58,237,0.08)_0%,transparent_70%)]" />
        </div>

        <div className="relative z-10 mb-12 lg:mb-16">
          <a href="/" className="group inline-flex items-center gap-2">
            <svg
              viewBox="0 0 36 36"
              className="size-7 shrink-0"
              role="img"
              aria-hidden="true"
              style={{ filter: "drop-shadow(0 4px 12px rgba(124, 58, 237, 0.4))" }}
            >
              <defs>
                <linearGradient id="cv-r-bg" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#8b5cf6" />
                  <stop offset="50%" stopColor="#7c3aed" />
                  <stop offset="100%" stopColor="#6d28d9" />
                </linearGradient>
                <linearGradient id="cv-r-shine" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#fff" stopOpacity="0.25" />
                  <stop offset="50%" stopColor="#fff" stopOpacity="0.05" />
                  <stop offset="100%" stopColor="#fff" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="cv-r-play" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="100%" stopColor="#e9d5ff" />
                </linearGradient>
              </defs>
              <rect x="2" y="2" width="32" height="32" rx="8" fill="#4c1d95" />
              <rect x="1" y="1" width="32" height="32" rx="8" fill="url(#cv-r-bg)" />
              <rect x="1" y="1" width="32" height="16" rx="8" fill="url(#cv-r-shine)" />
              <path d="M14 11.5L24 18L14 24.5V11.5Z" fill="url(#cv-r-play)" />
              <path d="M14 11.5L14 24.5L24 18L14 11.5Z" fill="#fff" fillOpacity="0.15" style={{ transform: "translateX(-1px)" }} />
            </svg>
            <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-violet-400 to-purple-500 bg-clip-text text-transparent transition-all duration-300 group-hover:from-violet-300 group-hover:to-purple-400">
              ClipVerse
            </span>
          </a>
        </div>

        <motion.div
          className="relative z-10 mx-auto w-full max-w-md lg:mx-0"
          initial="hidden"
          animate="visible"
          variants={stagger}
        >
          <motion.div variants={fadeInUp} transition={{ duration: 0.5 }} className="mb-8">
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

            <div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-white/25" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder={mode === "register" ? "Password (min 8 chars)" : "Password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={mode === "register" ? 8 : undefined}
                  disabled={loading}
                  className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] py-3.5 pl-11 pr-11 text-sm text-white outline-none transition-colors placeholder:text-white/20 focus:border-violet-500/40 disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-white/25 transition-colors hover:text-white/50"
                  tabIndex={-1}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
              {mode === "login" && (
                <div className="mt-1.5 text-right">
                  <a href="/forgot-password" className="text-xs text-white/30 hover:text-violet-400 transition-colors">
                    Forgot password?
                  </a>
                </div>
              )}
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

          <motion.p
            variants={fadeInUp}
            transition={{ duration: 0.4 }}
            className="mt-8 text-center text-xs text-white/20"
          >
            By continuing, you agree to our{" "}
            <a href="/privacy" className="text-white/30 underline underline-offset-2 transition-colors hover:text-violet-400">
              Privacy Policy
            </a>{" "}
            and{" "}
            <a href="/terms" className="text-white/30 underline underline-offset-2 transition-colors hover:text-violet-400">
              Terms of Service
            </a>
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#0a0a0f]">
          <Loader2 className="size-6 animate-spin text-violet-400" />
        </div>
      }
    >
      <LoginPageContent />
    </Suspense>
  );
}
