export type Platform =
  | "youtube"
  | "tiktok"
  | "instagram"
  | "twitter"
  | "bilibili"
  | "xiaohongshu"
  | "douyin"
  | "facebook"
  | "threads"
  | "pinterest"
  | "vimeo"
  | "other";

export type MediaType = "video" | "audio" | "image" | "gallery";

export type ParseState = "idle" | "parsing" | "success" | "error";

export type VideoQuality = "4K" | "2K" | "1080p" | "720p" | "480p" | "360p" | "240p" | "144p";
export type VideoCodec = "H.264" | "VP9" | "AV1";
export type AudioCodec = "AAC" | "Opus" | "MP3";

export interface VideoFormat {
  formatId: string;
  quality: VideoQuality;
  codec: VideoCodec;
  container: string;
  fileSize?: string;
  hasAudio: boolean;
  fps?: number;
  bitrate?: string;
}

export interface AudioFormat {
  formatId: string;
  quality: string;
  codec: AudioCodec;
  container: string;
  fileSize?: string;
  language?: string;
}

export interface SubtitleTrack {
  language: string;
  languageCode: string;
  url: string;
  format: "srt" | "vtt" | "ass";
}

export interface ParsedVideo {
  id: string;
  url: string;
  platform: Platform;
  title: string;
  description?: string;
  thumbnail?: string;
  duration?: number;
  author?: string;
  authorAvatar?: string;
  uploadDate?: string;
  viewCount?: number;
  videoFormats: VideoFormat[];
  audioFormats: AudioFormat[];
  mediaType: MediaType;
  images?: string[];
  subtitles?: SubtitleTrack[];
}

export interface ParseRequest {
  url: string;
}

export interface ParseResponse {
  success: boolean;
  data?: ParsedVideo;
  error?: string;
}

export interface DownloadRequest {
  url: string;
  formatId: string;
  type: "video" | "audio" | "subtitle";
}

export interface DownloadResponse {
  success: boolean;
  downloadUrl?: string;
  filename?: string;
  error?: string;
}
