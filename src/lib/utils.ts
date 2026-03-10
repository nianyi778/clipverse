import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function extractUrl(input: string): string {
  const trimmed = input.trim();
  try { new URL(trimmed); return trimmed; } catch {}
  const match = trimmed.match(/https?:\/\/[^\s\u3000-\u9fff\uff00-\uffef\u{1F000}-\u{1FFFF}]+/u);
  if (match) return match[0].replace(/[^\w\-._~:/?#[\]@!$&'()*+,;=%]+$/, "");
  return trimmed;
}
