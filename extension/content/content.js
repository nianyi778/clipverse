(() => {
  const API_BASE = "https://clipverse.com";
  const BUTTON_ID = "clipverse-download-btn";
  const TOAST_ID = "clipverse-toast";

  const PLATFORM_SELECTORS = {
    "youtube.com": {
      container: "#above-the-fold #title",
      anchor: "afterend",
    },
    "tiktok.com": {
      container: '[data-e2e="browse-video-desc"]',
      anchor: "afterend",
    },
    "bilibili.com": {
      container: ".video-toolbar-left",
      anchor: "beforeend",
    },
    "instagram.com": {
      container: "article header",
      anchor: "afterend",
    },
    "twitter.com": {
      container: '[data-testid="videoPlayer"]',
      anchor: "afterend",
    },
    "x.com": {
      container: '[data-testid="videoPlayer"]',
      anchor: "afterend",
    },
    "facebook.com": {
      container: '[data-pagelet="WatchPermalink"] .x1yztbdb',
      fallback: "video",
      anchor: "afterend",
    },
    "vimeo.com": {
      container: ".clip_info-subline",
      anchor: "afterend",
    },
    "xiaohongshu.com": {
      container: ".note-content",
      anchor: "afterend",
    },
    "douyin.com": {
      container: '[data-e2e="video-player-collect"]',
      anchor: "afterend",
    },
  };

  function getCurrentPlatform() {
    const hostname = window.location.hostname;
    for (const domain of Object.keys(PLATFORM_SELECTORS)) {
      if (hostname.includes(domain)) return domain;
    }
    return null;
  }

  function showToast(message) {
    let toast = document.getElementById(TOAST_ID);
    if (toast) toast.remove();

    toast = document.createElement("div");
    toast.id = TOAST_ID;
    toast.textContent = message;
    document.body.appendChild(toast);

    requestAnimationFrame(() => {
      toast.classList.add("clipverse-toast-visible");
    });

    setTimeout(() => {
      toast.classList.remove("clipverse-toast-visible");
      toast.classList.add("clipverse-toast-exit");
      setTimeout(() => toast.remove(), 400);
    }, 2000);
  }

  function createDownloadButton() {
    if (document.getElementById(BUTTON_ID)) return null;

    const btn = document.createElement("button");
    btn.id = BUTTON_ID;
    btn.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
        <polyline points="7 10 12 15 17 10"/>
        <line x1="12" y1="15" x2="12" y2="3"/>
      </svg>
      <span>Download</span>
    `;
    btn.setAttribute("data-clipverse-tooltip", "Download with ClipVerse");
    btn.addEventListener("click", handleDownloadClick);
    return btn;
  }

  function handleDownloadClick(e) {
    e.preventDefault();
    e.stopPropagation();

    const url = window.location.href;
    const downloadUrl = `${API_BASE}/download?url=${encodeURIComponent(url)}`;
    showToast("Opening in ClipVerse\u2026");
    window.open(downloadUrl, "_blank");
  }

  function injectButton() {
    if (document.getElementById(BUTTON_ID)) return;

    const platform = getCurrentPlatform();
    if (!platform) return;

    const config = PLATFORM_SELECTORS[platform];
    let container = document.querySelector(config.container);

    if (!container && config.fallback) {
      container = document.querySelector(config.fallback);
    }

    if (!container) {
      const video = document.querySelector("video");
      if (video) {
        container = video.parentElement;
      }
    }

    if (!container) return;

    const btn = createDownloadButton();
    if (!btn) return;

    const anchor = container === document.querySelector("video")?.parentElement
      ? "afterend"
      : config.anchor;

    container.insertAdjacentElement(anchor, btn);
  }

  let debounceTimer = null;

  function init() {
    injectButton();

    const observer = new MutationObserver(() => {
      if (debounceTimer) clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        if (!document.getElementById(BUTTON_ID)) {
          injectButton();
        }
      }, 150);
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
