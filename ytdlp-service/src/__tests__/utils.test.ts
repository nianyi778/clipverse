import { describe, it, expect } from "vitest";
import { expandCookieDomains, extractShareUrl } from "../utils.js";

describe("expandCookieDomains", () => {
  const sampleCookies = [
    "# Netscape HTTP Cookie File",
    ".douyin.com\tTRUE\t/\tFALSE\t9999999999\tsid_guard\tabc123",
    "www.douyin.com\tTRUE\t/\tFALSE\t9999999999\tpassport_csrf_token\txyz789",
    "douyin.com\tTRUE\t/\tFALSE\t9999999999\tuid_tt\tuid456",
    ".other.com\tTRUE\t/\tFALSE\t9999999999\ttoken\tother_token",
  ].join("\n");

  it("duplicates douyin.com cookies for iesdouyin.com", () => {
    const result = expandCookieDomains(sampleCookies, { "douyin.com": "iesdouyin.com" });
    expect(result).toContain("iesdouyin.com");
    expect(result).toContain(".iesdouyin.com");
  });

  it("preserves original cookies unchanged", () => {
    const result = expandCookieDomains(sampleCookies, { "douyin.com": "iesdouyin.com" });
    expect(result).toContain(".douyin.com\tTRUE\t/\tFALSE\t9999999999\tsid_guard\tabc123");
    expect(result).toContain("www.douyin.com\tTRUE\t/\tFALSE\t9999999999\tpassport_csrf_token\txyz789");
  });

  it("copies cookie values to expanded domain", () => {
    const result = expandCookieDomains(sampleCookies, { "douyin.com": "iesdouyin.com" });
    expect(result).toContain("iesdouyin.com\tTRUE\t/\tFALSE\t9999999999\tsid_guard\tabc123");
    expect(result).toContain(".iesdouyin.com\tTRUE\t/\tFALSE\t9999999999\tsid_guard\tabc123");
  });

  it("does not expand unrelated domains", () => {
    const result = expandCookieDomains(sampleCookies, { "douyin.com": "iesdouyin.com" });
    const lines = result.split("\n");
    const otherExpanded = lines.filter(l => l.includes("other.com") && l.includes("iesdouyin"));
    expect(otherExpanded).toHaveLength(0);
  });

  it("returns content unchanged when no domains match", () => {
    const result = expandCookieDomains(sampleCookies, { "nomatch.com": "other.com" });
    expect(result).toBe(sampleCookies);
  });

  it("skips comment lines and blank lines", () => {
    const result = expandCookieDomains(sampleCookies, { "douyin.com": "iesdouyin.com" });
    const lines = result.split("\n").filter(l => l.includes("iesdouyin.com"));
    for (const l of lines) expect(l).not.toMatch(/^#/);
  });
});

describe("extractShareUrl", () => {
  it("returns clean URL unchanged", () => {
    expect(extractShareUrl("https://www.youtube.com/watch?v=abc123")).toBe("https://www.youtube.com/watch?v=abc123");
  });

  it("extracts URL from douyin share text", () => {
    const text = "4.17 V@Y.mq 02/16 xFu:/ 小勇搬砖到深夜，收入一千毛利很不理想   https://v.douyin.com/9406h_880nQ/ 复制此链接，打开Dou音搜索，直接观看视频！";
    expect(extractShareUrl(text)).toBe("https://v.douyin.com/9406h_880nQ/");
  });

  it("extracts URL from tiktok share text", () => {
    const text = "Check this out! https://vm.tiktok.com/ZMxxxxxx/ 复制此链接";
    expect(extractShareUrl(text)).toBe("https://vm.tiktok.com/ZMxxxxxx/");
  });

  it("stops at CJK characters when URL is embedded in share text", () => {
    const text = "看这个视频 https://example.com/video复制此链接 打开看看";
    const result = extractShareUrl(text);
    expect(result).toBe("https://example.com/video");
  });

  it("strips trailing fullwidth punctuation from matched URL", () => {
    const text = "分享 https://example.com/abc。";
    const result = extractShareUrl(text);
    expect(result).toBe("https://example.com/abc");
  });

  it("returns original text when no URL found", () => {
    expect(extractShareUrl("no url here")).toBe("no url here");
  });

  it("handles http URLs", () => {
    expect(extractShareUrl("http://example.com/video")).toBe("http://example.com/video");
  });
});
