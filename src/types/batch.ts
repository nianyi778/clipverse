import type { ParsedVideo } from "./video";

export type BatchItemStatus = "queued" | "parsing" | "ready" | "downloading" | "completed" | "failed";

export interface BatchItem {
  id: string;
  url: string;
  status: BatchItemStatus;
  video?: ParsedVideo;
  selectedFormatId?: string;
  progress?: number;
  error?: string;
  title?: string;
  thumbnail?: string;
  duration?: number;
  formats?: number;
}

export interface BatchRequest {
  urls: string[];
}

export interface BatchResponse {
  success: boolean;
  items?: BatchItem[];
  error?: string;
}
