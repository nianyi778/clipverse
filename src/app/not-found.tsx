import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#05070b] px-6">
      <p className="text-8xl font-bold tracking-tight text-white/10">404</p>
      <h1 className="mt-4 text-2xl font-semibold text-white">
        Page not found
      </h1>
      <p className="mt-2 text-sm text-white/40">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link
        href="/"
        className="mt-8 rounded-xl bg-gradient-to-r from-violet-600 to-purple-500 px-6 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
      >
        Back to Home
      </Link>
    </div>
  );
}
