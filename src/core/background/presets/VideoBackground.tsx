"use client";

import CloudflareStreamVideo from "@/components/media/CloudflareStreamVideo";

interface VideoBackgroundProps {
  cloudflareStreamId?: string;
  videoUrl?: string;
  posterUrl?: string;
  overlayOpacity?: number;
}

/**
 * VideoBackground - Full-screen video background
 *
 * Uses CloudflareStreamVideo with HLS.js for optimized playback.
 * Always autoplay, muted, looped, no controls.
 */
export default function VideoBackground({
  cloudflareStreamId,
  videoUrl,
  posterUrl,
  overlayOpacity = 0.35,
}: VideoBackgroundProps) {
  // Extract UID from cloudflareStreamId or videoUrl
  const uid = cloudflareStreamId || videoUrl?.split("/").reverse()[2];

  if (!uid) return null;

  return (
    <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none" aria-hidden="true">
      {/* Video layer */}
      <CloudflareStreamVideo
        uid={uid}
        posterUrl={posterUrl}
        mode="background"
        allowAudio={true}
        className="absolute inset-0"
        objectFit="cover"
      />

      {/* Overlay for readability */}
      <div className="absolute inset-0 bg-black" style={{ opacity: overlayOpacity }} />
    </div>
  );
}
