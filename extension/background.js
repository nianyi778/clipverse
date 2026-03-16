const API_BASE = "https://clipverse.divinations.top";

const SUPPORTED_DOMAINS = [
  "youtube.com", "youtu.be", "tiktok.com", "instagram.com",
  "twitter.com", "x.com", "bilibili.com", "b23.tv",
  "xiaohongshu.com", "douyin.com", "facebook.com",
  "vimeo.com", "pinterest.com", "threads.net",
];

function isSupportedUrl(url) {
  try {
    const hostname = new URL(url).hostname;
    return SUPPORTED_DOMAINS.some((domain) => hostname.includes(domain));
  } catch {
    return false;
  }
}

chrome.action.onClicked.addListener((tab) => {
  if (tab.url && isSupportedUrl(tab.url)) {
    const downloadUrl = `${API_BASE}/download?url=${encodeURIComponent(tab.url)}`;
    chrome.tabs.create({ url: downloadUrl });
  }
});

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === "GET_VIDEO_URL") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      sendResponse({ url: tabs[0]?.url ?? "" });
    });
    return true;
  }
});
