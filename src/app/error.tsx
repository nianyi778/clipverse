"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: globalThis.Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#05070b] px-6">
      <p className="text-6xl font-bold tracking-tight text-white/10">Oops</p>
      <h1 className="mt-4 text-2xl font-semibold text-white">
        Something went wrong
      </h1>
      <p className="mt-2 max-w-md text-center text-sm text-white/40">
        An unexpected error occurred. Please try again.
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-8 rounded-xl bg-gradient-to-r from-violet-600 to-purple-500 px-6 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
      >
        Try Again
      </button>
    </div>
  );
}
