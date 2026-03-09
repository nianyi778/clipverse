"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useSession, signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown, Globe, ArrowRight, LogOut, LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavLink {
  label: string;
  href: string;
  hasDropdown?: boolean;
}

const navLinks: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "Download", href: "/download" },
  { label: "Tools", href: "/youtube", hasDropdown: true },
  { label: "Pricing", href: "/pricing" },
];

const toolsDropdown = [
  { label: "YouTube Downloader", href: "/youtube" },
  { label: "TikTok No Watermark", href: "/tiktok" },
  { label: "Instagram Reels", href: "/instagram" },
  { label: "Twitter / X Video", href: "/twitter" },
  { label: "Facebook Video", href: "/facebook" },
  { label: "Bilibili Downloader", href: "/bilibili" },
  { label: "抖音下载器", href: "/douyin" },
  { label: "小红书下载器", href: "/xiaohongshu" },
];

export function Navbar() {
  const { data: session, status } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const toolsRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const isAuthed = status === "authenticated" && !!session?.user;

  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > 20);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (toolsRef.current && !toolsRef.current.contains(e.target as Node)) {
        setToolsOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const closeMobile = useCallback(() => setMobileOpen(false), []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-black/70 backdrop-blur-2xl border-b border-white/[0.06]"
          : "bg-transparent"
      )}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <a href="/" className="flex items-center gap-2.5 select-none group">
          <svg
            viewBox="0 0 32 32"
            className="size-8 shrink-0 drop-shadow-[0_0_8px_rgba(139,92,246,0.3)]"
            role="img"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="cv-bg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#7c3aed" />
                <stop offset="100%" stopColor="#a855f7" />
              </linearGradient>
              <linearGradient id="cv-play" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fff" stopOpacity="0.95" />
                <stop offset="100%" stopColor="#e9d5ff" stopOpacity="0.9" />
              </linearGradient>
            </defs>
            <rect width="32" height="32" rx="8" fill="url(#cv-bg)" />
            <path d="M13 10l10 6-10 6V10z" fill="url(#cv-play)" />
            <rect x="21" y="18" width="2.5" height="6" rx="1.25" fill="#fff" opacity="0.7" />
          </svg>
          <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-violet-400 to-purple-500 bg-clip-text text-transparent transition-all duration-300 group-hover:from-violet-300 group-hover:to-purple-400">
            ClipVerse
          </span>
        </a>

        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) =>
            link.hasDropdown ? (
              <div key={link.label} ref={toolsRef} className="relative">
                <button
                  type="button"
                  onClick={() => setToolsOpen((p) => !p)}
                  className="flex cursor-pointer items-center gap-1 text-sm text-white/60 transition-colors hover:text-white"
                >
                  {link.label}
                  <ChevronDown
                    className={cn(
                      "size-3 transition-transform duration-200",
                      toolsOpen && "rotate-180"
                    )}
                  />
                </button>
                <AnimatePresence>
                  {toolsOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      transition={{ duration: 0.15 }}
                      className="absolute left-1/2 top-full mt-3 w-56 -translate-x-1/2 rounded-xl border border-white/[0.08] bg-black/90 p-2 shadow-2xl backdrop-blur-2xl"
                    >
                      {toolsDropdown.map((tool) => (
                        <a
                          key={tool.href}
                          href={tool.href}
                          onClick={() => setToolsOpen(false)}
                          className="block rounded-lg px-3 py-2.5 text-sm text-white/60 transition-colors hover:bg-white/[0.06] hover:text-white"
                        >
                          {tool.label}
                        </a>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <a
                key={link.label}
                href={link.href}
                className="flex items-center gap-1 text-sm text-white/60 transition-colors hover:text-white"
              >
                {link.label}
              </a>
            )
          )}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <button
            type="button"
            className="flex cursor-pointer items-center gap-1.5 rounded-md px-2 py-1.5 text-sm text-white/50 transition-colors hover:text-white/80"
          >
            <Globe className="size-3.5" />
            EN
          </button>
          {isAuthed ? (
            <div ref={userMenuRef} className="relative">
              <button
                type="button"
                onClick={() => setUserMenuOpen((p) => !p)}
                className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-white/70 transition-colors hover:bg-white/[0.06] hover:text-white"
              >
                {session.user?.image ? (
                  <img
                    src={session.user.image}
                    alt=""
                    className="size-6 rounded-full"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="flex size-6 items-center justify-center rounded-full bg-violet-600 text-xs font-bold text-white">
                    {(session.user?.name?.[0] || session.user?.email?.[0] || "U").toUpperCase()}
                  </div>
                )}
                <span className="max-w-[120px] truncate">
                  {session.user?.name || session.user?.email?.split("@")[0]}
                </span>
                <ChevronDown className={cn("size-3 transition-transform", userMenuOpen && "rotate-180")} />
              </button>
              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 w-48 rounded-xl border border-white/[0.08] bg-black/90 p-1.5 shadow-2xl backdrop-blur-2xl"
                  >
                    <div className="border-b border-white/[0.06] px-3 py-2">
                      <p className="truncate text-xs text-white/50">{session.user?.email}</p>
                    </div>
                    <a
                      href="/dashboard"
                      onClick={() => setUserMenuOpen(false)}
                      className="mt-1 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-white/60 transition-colors hover:bg-white/[0.06] hover:text-white"
                    >
                      <LayoutDashboard className="size-3.5" />
                      Dashboard
                    </a>
                    <button
                      type="button"
                      onClick={() => signOut({ callbackUrl: "/" })}
                      className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm text-white/60 transition-colors hover:bg-white/[0.06] hover:text-white"
                    >
                      <LogOut className="size-3.5" />
                      Log out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <>
              <a
                href="/login"
                className="rounded-lg px-3 py-1.5 text-sm text-white/60 transition-colors hover:text-white"
              >
                Log in
              </a>
              <a
                href="/register"
                className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-violet-600 to-purple-600 px-4 py-2 text-sm font-medium text-white transition-all hover:from-violet-500 hover:to-purple-500 hover:shadow-[0_0_24px_rgba(124,58,237,0.3)]"
              >
                Get Started
                <ArrowRight className="size-3.5" />
              </a>
            </>
          )}
        </div>

        <button
          type="button"
          className="cursor-pointer p-1 text-white/60 hover:text-white md:hidden"
          onClick={() => setMobileOpen((prev) => !prev)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-white/[0.06] bg-black/95 backdrop-blur-2xl md:hidden"
          >
            <div className="flex flex-col gap-1 px-6 py-5">
              {navLinks.map((link) =>
                link.hasDropdown ? (
                  <div key={link.label}>
                    <span className="block rounded-lg px-3 py-2.5 text-xs font-semibold uppercase tracking-wider text-white/30">
                      {link.label}
                    </span>
                    <div className="ml-2 flex flex-col gap-0.5">
                      {toolsDropdown.map((tool) => (
                        <a
                          key={tool.href}
                          href={tool.href}
                          onClick={closeMobile}
                          className="rounded-lg px-3 py-2 text-sm text-white/50 transition-colors hover:bg-white/[0.04] hover:text-white"
                        >
                          {tool.label}
                        </a>
                      ))}
                    </div>
                  </div>
                ) : (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={closeMobile}
                    className="rounded-lg px-3 py-2.5 text-white/60 transition-colors hover:bg-white/[0.04] hover:text-white"
                  >
                    {link.label}
                  </a>
                )
              )}
              <div className="mt-3 flex flex-col gap-2 border-t border-white/[0.06] pt-4">
                {isAuthed ? (
                  <>
                    <div className="flex items-center gap-2 px-3 py-2">
                      {session.user?.image ? (
                        <img src={session.user.image} alt="" className="size-6 rounded-full" referrerPolicy="no-referrer" />
                      ) : (
                        <div className="flex size-6 items-center justify-center rounded-full bg-violet-600 text-xs font-bold text-white">
                          {(session.user?.name?.[0] || session.user?.email?.[0] || "U").toUpperCase()}
                        </div>
                      )}
                      <span className="truncate text-sm text-white/70">{session.user?.name || session.user?.email?.split("@")[0]}</span>
                    </div>
                    <a
                      href="/dashboard"
                      onClick={closeMobile}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-white/50 transition-colors hover:bg-white/[0.04] hover:text-white"
                    >
                      <LayoutDashboard className="size-4" />
                      Dashboard
                    </a>
                    <button
                      type="button"
                      onClick={() => signOut({ callbackUrl: "/" })}
                      className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-2.5 text-white/50 transition-colors hover:bg-white/[0.04] hover:text-white"
                    >
                      <LogOut className="size-4" />
                      Log out
                    </button>
                  </>
                ) : (
                  <>
                    <a
                      href="/login"
                      className="px-3 py-2.5 text-white/50 transition-colors hover:text-white"
                    >
                      Log in
                    </a>
                    <a
                      href="/register"
                      className="rounded-lg bg-gradient-to-r from-violet-600 to-purple-600 px-4 py-2.5 text-center text-sm font-medium text-white"
                    >
                      Get Started Free
                    </a>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
