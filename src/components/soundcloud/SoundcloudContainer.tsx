"use client";

/**
 * SoundcloudContainer Component
 *
 * Container managing the accordion effect for SoundCloud tracks.
 * Features:
 * - Responsive: flex-row on desktop, flex-col on mobile
 * - Hover/click to expand individual cards
 * - Smooth transitions using flex-grow
 */

import { useState, useCallback } from "react";
import { SoundcloudTrackCard } from "./SoundcloudTrackCard";
import { cn } from "@/lib/cn";
import type { SoundcloudTrackView } from "@/types";

// =============================================================================
// Types
// =============================================================================

interface SoundcloudContainerProps {
  tracks: SoundcloudTrackView[];
  className?: string;
}

// =============================================================================
// Component
// =============================================================================

export function SoundcloudContainer({ tracks, className }: SoundcloudContainerProps) {
  // Track which card is expanded (null = none expanded, first card expanded by default)
  const [expandedIndex, setExpandedIndex] = useState<number>(0);

  const handleExpand = useCallback((index: number) => {
    setExpandedIndex(index);
  }, []);

  // Limit to 6 tracks max
  const displayTracks = tracks.slice(0, 6);

  return (
    <div
      className={cn(
        // Flex container
        "flex",
        // Responsive direction
        "flex-col lg:flex-row",
        // Gap between cards
        "gap-2 lg:gap-3",
        // Container sizing - fixed height to prevent jumping
        "w-full",
        // Fixed height on desktop for smooth accordion
        "lg:h-[400px] xl:h-[450px] 2xl:h-[500px]",
        className,
      )}
    >
      {displayTracks.map((track, index) => (
        <SoundcloudTrackCard
          key={track.id}
          track={track}
          isExpanded={expandedIndex === index}
          onExpand={() => handleExpand(index)}
        />
      ))}
    </div>
  );
}

export default SoundcloudContainer;
