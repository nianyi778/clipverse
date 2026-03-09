const API_BASE = "https://clipverse.com";

const SUPPORTED_DOMAINS = [
  "youtube.com", "youtu.be", "tiktok.com", "instagram.com",
  "twitter.com", "x.com", "bilibili.com", "b23.tv",
  "xiaohongshu.com", "douyin.com", "facebook.com",
  "vimeo.com", "pinterest.com", "threads.net",
];

const PLATFORM_NAMES = {
  "youtube.com": "YouTube",
  "youtu.be": "YouTube",
  "tiktok.com": "TikTok",
  "instagram.com": "Instagram",
  "twitter.com": "Twitter / X",
  "x.com": "Twitter / X",
  "bilibili.com": "Bilibili",
  "b23.tv": "Bilibili",
  "xiaohongshu.com": "Xiaohongshu",
  "douyin.com": "Douyin",
  "facebook.com": "Facebook",
  "vimeo.com": "Vimeo",
  "pinterest.com": "Pinterest",
  "threads.net": "Threads",
};

function detectPlatform(url) {
  try {
    const hostname = new URL(url).hostname;
    for (const domain of SUPPORTED_DOMAINS) {
      if (hostname.includes(domain)) return domain;
    }
  } catch {
    return null;
  }
  return null;
}

function openDownloadPage(url) {
  const target = `${API_BASE}/download?url=${encodeURIComponent(url)}`;
  chrome.tabs.create({ url: target });
}

function setStatus(el, text, className) {
  el.textContent = text;
  el.className = "status visible " + className;
}

document.addEventListener("DOMContentLoaded", () => {
  const detectedEl = document.getElementById("detected");
  const platformNameEl = document.getElementById("platform-name");
  const pageUrlEl = document.getElementById("page-url");
  const downloadBtn = document.getElementById("download-btn");
  const btnLabel = downloadBtn.querySelector(".btn-label");
  const spinnerEl = downloadBtn.querySelector(".spinner");
  const urlInput = document.getElementById("url-input");
  const parseBtn = document.getElementById("parse-btn");
  const statusEl = document.getElementById("status");

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const currentUrl = tabs[0]?.url ?? "";
    const platform = detectPlatform(currentUrl);

    if (platform) {
      detectedEl.classList.remove("hidden");
      platformNameEl.textContent = PLATFORM_NAMES[platform] ?? platform;
      pageUrlEl.textContent = currentUrl;

      setStatus(
        statusEl,
        "\u2713 Video detected on " + (PLATFORM_NAMES[platform] ?? platform),
        "status-success"
      );
    } else {
      setStatus(statusEl, "No video detected", "status-idle");
    }

    downloadBtn.addEventListener("click", () => {
      if (platform) {
        downloadBtn.classList.add("downloading");
        btnLabel.textContent = "Downloading\u2026";
        spinnerEl.classList.remove("hidden");

        setStatus(statusEl, "Opening ClipVerse\u2026", "status-loading");

        openDownloadPage(currentUrl);

        setTimeout(() => {
          btnLabel.textContent = "Opening ClipVerse\u2026";
          spinnerEl.classList.add("hidden");
        }, 800);

        setTimeout(() => {
          downloadBtn.classList.remove("downloading");
          btnLabel.textContent = "Download This Video";
          setStatus(
            statusEl,
            "\u2713 Video detected on " + (PLATFORM_NAMES[platform] ?? platform),
            "status-success"
          );
        }, 2000);
      } else {
        urlInput.focus();
      }
    });
  });

  parseBtn.addEventListener("click", () => {
    const url = urlInput.value.trim();
    if (url) openDownloadPage(url);
  });

  urlInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const url = urlInput.value.trim();
      if (url) openDownloadPage(url);
    }
  });
});
