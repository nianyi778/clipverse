"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, Mail, Loader2 } from "lucide-react";
import { Navbar } from "@/components/navbar";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const success = searchParams.get("success") === "1";
  const error = searchParams.get("error");

  if (success) {
    return (
      <div className="text-center">
        <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-emerald-500/10">
          <CheckCircle className="size-7 text-emerald-400" />
        </div>
        <h1 className="mb-2 text-xl font-bold text-white">Email verified!</h1>
        <p className="text-sm text-white/50">Your email address has been verified. You&apos;re all set.</p>
        <a href="/dashboard" className="mt-6 inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-violet-600 to-purple-600 px-5 py-2.5 text-sm font-semibold text-white hover:from-violet-500 hover:to-purple-500">
          Go to Dashboard
        </a>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center">
        <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-red-500/10">
          <XCircle className="size-7 text-red-400" />
        </div>
        <h1 className="mb-2 text-xl font-bold text-white">Verification failed</h1>
        <p className="text-sm text-white/50">
          {error === "invalid" ? "This link is invalid or has already been used." : "Verification link is missing."}
        </p>
        <a href="/dashboard" className="mt-6 inline-block text-sm text-violet-400 hover:text-violet-300">
          Request a new verification email from Dashboard →
        </a>
      </div>
    );
  }

  return (
    <div className="text-center">
      <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-violet-500/10">
        <Mail className="size-7 text-violet-400" />
      </div>
      <h1 className="mb-2 text-xl font-bold text-white">Verify your email</h1>
      <p className="text-sm text-white/50">Check your inbox for a verification link from ClipVerse.</p>
    </div>
  );
}

export default function VerifyEmailPage() {
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
              <VerifyEmailContent />
            </Suspense>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
