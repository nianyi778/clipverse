"use client";

import { Send } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export function Footer() {
  const { t } = useI18n();

  return (
    <footer className="border-t border-white/[0.04] px-6 py-16">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 grid grid-cols-2 gap-10 md:grid-cols-4 md:gap-12">
          <div className="col-span-2 md:col-span-1">
            <span className="bg-gradient-to-r from-violet-400 to-purple-500 bg-clip-text text-xl font-bold tracking-tight text-transparent">
              ClipVerse
            </span>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-white/30">
              {t("footer.slogan")}
            </p>
            <a
              href="https://t.me/clipverse"
              className="mt-4 inline-flex items-center gap-2 text-sm text-white/30 transition-colors hover:text-white/60"
            >
              <Send className="size-4" />
              Telegram
            </a>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold text-white/60">
              {t("footer.product")}
            </h4>
            <ul className="space-y-2.5">
              {["Home", "Download", "Pricing", "Chrome Extension"].map((link) => {
                const url = link === "Chrome Extension" ? "/chrome-extension" : `/${link.toLowerCase()}`;
                return (
                  <li key={link}>
                    <a
                      href={url}
                      className="text-sm text-white/30 transition-colors hover:text-white/60"
                    >
                      {t(`nav.${link.toLowerCase()}`) !== `nav.${link.toLowerCase()}` ? t(`nav.${link.toLowerCase()}`) : link}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold text-white/60">
              {t("footer.support")}
            </h4>
            <ul className="space-y-2.5">
              {["FAQ", "Blog", "Contact", "API Docs"].map((link) => {
                const url = link === "API Docs" ? "/api-docs" : `/${link.toLowerCase()}`;
                return (
                  <li key={link}>
                    <a
                      href={url}
                      className="text-sm text-white/30 transition-colors hover:text-white/60"
                    >
                      {t(`footer.link.${link.toLowerCase().replace(" ", "")}`) !== `footer.link.${link.toLowerCase().replace(" ", "")}` ? t(`footer.link.${link.toLowerCase().replace(" ", "")}`) : link}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold text-white/60">
              {t("footer.popular")}
            </h4>
            <ul className="space-y-2.5">
              {[
                { label: "YouTube 4K Downloader", href: "/youtube" },
                { label: "TikTok No Watermark", href: "/tiktok" },
                { label: "Instagram Reels Saver", href: "/instagram" },
                { label: "Bilibili Video Download", href: "/bilibili" },
                { label: "Twitter Video Download", href: "/twitter" },
              ].map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-white/30 transition-colors hover:text-white/60"
                  >
                    {t(`footer.popular.${link.href.replace("/", "")}`)}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/[0.04] pt-8 md:flex-row">
          <p className="text-xs text-white/20">
            &copy; 2026 ClipVerse. {t("footer.rights")}
          </p>
          <div className="flex items-center gap-6">
            {["Privacy", "Terms", "DMCA"].map((link) => (
              <a
                key={link}
                href={`/${link.toLowerCase()}`}
                className="text-xs text-white/20 transition-colors hover:text-white/40"
              >
                {t(`footer.link.${link.toLowerCase()}`) !== `footer.link.${link.toLowerCase()}` ? t(`footer.link.${link.toLowerCase()}`) : link}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
