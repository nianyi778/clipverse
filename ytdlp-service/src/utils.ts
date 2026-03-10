export function expandCookieDomains(content: string, domainMap: Record<string, string>): string {
  const extra: string[] = [];
  for (const line of content.split("\n")) {
    if (line.startsWith("#") || !line.trim()) continue;
    const parts = line.split("\t");
    if (parts.length < 7) continue;
    const from = Object.keys(domainMap).find(d => parts[0] === d || parts[0] === `.${d}` || parts[0] === `www.${d}`);
    if (from) {
      extra.push([domainMap[from], ...parts.slice(1)].join("\t"));
      extra.push([`.${domainMap[from]}`, ...parts.slice(1)].join("\t"));
    }
  }
  return extra.length ? `${content}\n${extra.join("\n")}` : content;
}

export function extractShareUrl(input: string): string {
  const trimmed = input.trim();
  try { new URL(trimmed); return trimmed; } catch {}
  const match = trimmed.match(/https?:\/\/[^\s\u3000-\u9fff\uff00-\uffef]+/);
  if (match) return match[0].replace(/[^\w\-._~:/?#[\]@!$&'()*+,;=%]+$/, "");
  return trimmed;
}
