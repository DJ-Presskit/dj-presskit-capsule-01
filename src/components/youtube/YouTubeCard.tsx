"use client";

/**
 * YouTubeCard Component
 *
 * Displays a YouTube video thumbnail with:
 * - Video thumbnail image
 * - Centered play button overlay
 * - Title (fetched via oEmbed if not provided)
 * - Click to play or open YouTube
 */

import { useState, useEffect } from "react";
import Image from "next/image";
import { Play } from "lucide-react";
import { cn } from "@/lib/cn";
import { getYoutubeThumbnailUrl, getYoutubeWatchUrl } from "@/domain/validators";

// =============================================================================
// Types
// =============================================================================

export interface YouTubeCardProps {
  videoId: string;
  title?: string;
  onPlay?: () => void;
  className?: string;
}

// =============================================================================
// Helpers
// =============================================================================

/**
 * Fetch video title from YouTube oEmbed API
 */
async function fetchVideoTitle(videoId: string): Promise<string | null> {
  try {
    const url = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;
    const response = await fetch(url);
    if (!response.ok) return null;
    const data = await response.json();
    return data.title || null;
  } catch {
    return null;
  }
}

// =============================================================================
// Component
// =============================================================================

export function YouTubeCard({
  videoId,
  title: providedTitle,
  onPlay,
  className,
}: YouTubeCardProps) {
  const [title, setTitle] = useState<string>(providedTitle || "");
  const [thumbnailError, setThumbnailError] = useState(false);

  // Fetch title from oEmbed if not provided
  useEffect(() => {
    if (!providedTitle && videoId) {
      fetchVideoTitle(videoId).then((fetchedTitle) => {
        if (fetchedTitle) setTitle(fetchedTitle);
      });
    }
  }, [videoId, providedTitle]);

  const thumbnailUrl = getYoutubeThumbnailUrl(videoId, thumbnailError ? "hq" : "maxres");
  const watchUrl = getYoutubeWatchUrl(videoId);

  const handleClick = () => {
    if (onPlay) {
      onPlay();
    } else {
      window.open(watchUrl, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <article
      className={cn(
        "group relative cursor-pointer rounded-xl overflow-hidden bg-background-lighter",
        "transition-all duration-300 hover:ring-2 hover:ring-accent/50",
        className,
      )}
      onClick={handleClick}
    >
      {/* Thumbnail Container */}
      <div className="relative aspect-video w-full overflow-hidden">
        <Image
          src={thumbnailUrl}
          alt={title || "YouTube video"}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          onError={() => setThumbnailError(true)}
        />

        {/* Play Button Overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className={cn(
              "rounded-full bg-accent p-4 shadow-lg",
              "transition-all duration-300 group-hover:scale-110 group-hover:bg-accent/90",
            )}
          >
            <Play className="w-8 h-8 text-background-lighter fill-background-lighter" />
          </div>
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Title */}
      {title && (
        <div className="p-4 text-center">
          <h3 className="text-foreground font-bold uppercase text-sm md:text-base line-clamp-2">
            {title}
          </h3>
        </div>
      )}
    </article>
  );
}

export default YouTubeCard;
