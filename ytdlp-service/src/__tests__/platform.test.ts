import { describe, it, expect } from "vitest";
import { detectPlatform, getHostname, getPlatformArgs } from "../ytdlp.js";

describe("getHostname", () => {
  it("extracts hostname from URL", () => {
    expect(getHostname("https://www.youtube.com/watch?v=abc")).toBe("www.youtube.com");
    expect(getHostname("https://v.douyin.com/abc/")).toBe("v.douyin.com");
  });

  it("returns empty string for invalid URL", () => {
    expect(getHostname("not a url")).toBe("");
    expect(getHostname("")).toBe("");
  });
});

describe("detectPlatform", () => {
  const cases: [string, string][] = [
    ["https://www.youtube.com/watch?v=abc", "youtube"],
    ["https://youtu.be/abc", "youtube"],
    ["https://www.tiktok.com/@user/video/123", "tiktok"],
    ["https://vm.tiktok.com/abc", "tiktok"],
    ["https://www.instagram.com/p/abc/", "instagram"],
    ["https://instagr.am/p/abc/", "instagram"],
    ["https://x.com/user/status/123", "twitter"],
    ["https://twitter.com/user/status/123", "twitter"],
    ["https://www.bilibili.com/video/BV1abc", "bilibili"],
    ["https://b23.tv/abc", "bilibili"],
    ["https://www.xiaohongshu.com/explore/abc", "xiaohongshu"],
    ["https://xhslink.com/a/abc", "xiaohongshu"],
    ["https://www.douyin.com/video/123", "douyin"],
    ["https://v.douyin.com/abc/", "douyin"],
    ["https://www.iesdouyin.com/share/video/123/", "douyin"],
    ["https://www.facebook.com/watch/?v=123", "facebook"],
    ["https://fb.watch/abc", "facebook"],
    ["https://unknown-site.com/video", "other"],
  ];

  for (const [url, expected] of cases) {
    it(`detects ${expected} for ${new URL(url).hostname}`, () => {
      expect(detectPlatform(url)).toBe(expected);
    });
  }
});

describe("getPlatformArgs", () => {
  it("adds --xff US for TikTok", () => {
    const args = getPlatformArgs("https://www.tiktok.com/@user/video/123");
    expect(args).toContain("--xff");
    expect(args).toContain("US");
  });

  it("adds --impersonate chrome-124 for Instagram", () => {
    const args = getPlatformArgs("https://www.instagram.com/p/abc/");
    expect(args).toContain("--impersonate");
    expect(args).toContain("chrome-124");
  });

  it("adds --impersonate chrome-124 for Twitter", () => {
    const args = getPlatformArgs("https://x.com/user/status/123");
    expect(args).toContain("--impersonate");
    expect(args).toContain("chrome-124");
  });

  it("adds --impersonate chrome-99 and facebook extractor-args for Facebook", () => {
    const args = getPlatformArgs("https://www.facebook.com/watch/?v=123");
    expect(args).toContain("--impersonate");
    expect(args).toContain("chrome-99");
    expect(args).toContain("--extractor-args");
    const idx = args.indexOf("--extractor-args");
    expect(args[idx + 1]).toContain("facebook:formats");
  });

  it("applies same args for iesdouyin.com as douyin.com", () => {
    const douyinArgs = getPlatformArgs("https://www.douyin.com/video/123");
    const iesArgs = getPlatformArgs("https://www.iesdouyin.com/share/video/123/");
    expect(iesArgs).toEqual(douyinArgs);
  });

  it("applies same args for fb.watch as facebook.com", () => {
    const fbArgs = getPlatformArgs("https://www.facebook.com/watch/?v=123");
    const watchArgs = getPlatformArgs("https://fb.watch/abc");
    expect(watchArgs).toEqual(fbArgs);
  });

  it("applies same args for xhslink.com as xiaohongshu.com", () => {
    const xhsArgs = getPlatformArgs("https://www.xiaohongshu.com/explore/abc");
    const linkArgs = getPlatformArgs("https://xhslink.com/a/abc");
    expect(linkArgs).toEqual(xhsArgs);
  });

  it("returns empty array for unknown platform (no cookies file present)", () => {
    const args = getPlatformArgs("https://unknown-site.com/video");
    expect(args).toEqual([]);
  });
});
