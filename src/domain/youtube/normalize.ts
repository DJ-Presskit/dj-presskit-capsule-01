/**
 * YouTube Section Normalizer
 */

import type { YoutubeVM, YoutubeVideoVM } from "../types";
import { extractYoutubeId, generateStableKey } from "../validators";

interface YoutubeDTO {
  youtube?: {
    videos?: string[];
  };
}

const MAX_YOUTUBE_VIDEOS = 6;

export function normalizeYoutube(dto: YoutubeDTO | null | undefined): YoutubeVM {
  const videosRaw = dto?.youtube?.videos;

  if (!Array.isArray(videosRaw) || videosRaw.length === 0) {
    return {
      videos: [],
      hasVideos: false,
    };
  }

  const videos: YoutubeVideoVM[] = [];
  const seenIds = new Set<string>();

  for (let i = 0; i < videosRaw.length && videos.length < MAX_YOUTUBE_VIDEOS; i++) {
    const videoId = extractYoutubeId(videosRaw[i]);

    if (!videoId || seenIds.has(videoId)) continue;
    seenIds.add(videoId);

    videos.push({
      id: generateStableKey({ id: videoId }, i),
      videoId,
      embedUrl: `https://www.youtube.com/embed/${videoId}`,
    });
  }

  return {
    videos,
    hasVideos: videos.length > 0,
  };
}
