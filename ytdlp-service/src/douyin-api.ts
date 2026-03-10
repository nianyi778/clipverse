const DOUYIN_API_URL = process.env.DOUYIN_API_URL || "";

interface DouyinVideoData {
  aweme_id: string;
  desc: string;
  author: {
    nickname: string;
    unique_id: string;
    sec_uid: string;
  };
  video: {
    play_addr: {
      url_list: string[];
    };
    cover: {
      url_list: string[];
    };
    duration: number;
    width: number;
    height: number;
  };
  statistics: {
    digg_count: number;
    comment_count: number;
    share_count: number;
  };
}

interface DouyinApiResponse {
  code: number;
  message: string;
  data: DouyinVideoData;
}

export async function fetchDouyinVideo(url: string): Promise<{
  title: string;
  thumbnail: string;
  duration: number;
  videoUrl: string;
  author: string;
  width: number;
  height: number;
} | null> {
  if (!DOUYIN_API_URL) {
    console.log("[douyin-api] DOUYIN_API_URL not configured, skipping fallback");
    return null;
  }

  try {
    const apiUrl = `${DOUYIN_API_URL}/api/hybrid/video_data?url=${encodeURIComponent(url)}&minimal=false`;
    console.log(`[douyin-api] Fetching: ${apiUrl}`);

    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Accept": "application/json",
        "User-Agent": "ClipVerse/1.0",
      },
      signal: AbortSignal.timeout(30000),
    });

    if (!response.ok) {
      console.error(`[douyin-api] API returned ${response.status}`);
      return null;
    }

    const result = await response.json() as DouyinApiResponse;

    if (result.code !== 200 || !result.data) {
      console.error(`[douyin-api] API error: ${result.message}`);
      return null;
    }

    const data = result.data;
    const videoUrls = data.video?.play_addr?.url_list || [];
    const videoUrl = videoUrls[0] || "";

    if (!videoUrl) {
      console.error("[douyin-api] No video URL in response");
      return null;
    }

    return {
      title: data.desc || "Douyin Video",
      thumbnail: data.video?.cover?.url_list?.[0] || "",
      duration: Math.floor((data.video?.duration || 0) / 1000),
      videoUrl: videoUrl.replace(/^http:/, "https:"),
      author: data.author?.nickname || "",
      width: data.video?.width || 0,
      height: data.video?.height || 0,
    };
  } catch (error) {
    console.error("[douyin-api] Error fetching video:", error);
    return null;
  }
}

export function isDouyinUrl(url: string): boolean {
  try {
    const hostname = new URL(url).hostname.toLowerCase();
    return hostname.includes("douyin.com") || hostname.includes("iesdouyin.com");
  } catch {
    return false;
  }
}
