export const LOCALES = ["en", "zh-CN", "ja", "ko"] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";
export const LOCALE_COOKIE_NAME = "locale";

export function isLocale(value: string | null | undefined): value is Locale {
  return !!value && LOCALES.includes(value as Locale);
}

export function normalizeLocale(value: string | null | undefined): Locale | null {
  if (!value) {
    return null;
  }

  const lower = value.toLowerCase();

  if (lower.startsWith("zh")) {
    return "zh-CN";
  }

  if (lower.startsWith("ja")) {
    return "ja";
  }

  if (lower.startsWith("ko")) {
    return "ko";
  }

  if (lower.startsWith("en")) {
    return "en";
  }

  return isLocale(value) ? value : null;
}

export function detectLocale(
  sources: Array<string | null | undefined>,
  fallback: Locale = DEFAULT_LOCALE
): Locale {
  for (const source of sources) {
    const locale = normalizeLocale(source);
    if (locale) {
      return locale;
    }
  }

  return fallback;
}
