"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);
  return (
    <html lang="en" className="dark">
      <body style={{ margin: 0, background: "#05070b", fontFamily: "system-ui, sans-serif" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
            padding: "0 24px",
          }}
        >
          <p style={{ fontSize: 64, fontWeight: 700, color: "rgba(255,255,255,0.1)", margin: 0 }}>
            500
          </p>
          <h1 style={{ fontSize: 24, fontWeight: 600, color: "#fff", marginTop: 16 }}>
            Something went very wrong
          </h1>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.4)", marginTop: 8 }}>
            A critical error occurred. Please try refreshing the page.
          </p>
          <button
            type="button"
            onClick={reset}
            style={{
              marginTop: 32,
              padding: "10px 24px",
              borderRadius: 12,
              border: "none",
              background: "linear-gradient(135deg, #7c3aed, #a855f7)",
              color: "#fff",
              fontSize: 14,
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            Try Again
          </button>
        </div>
      </body>
    </html>
  );
}
