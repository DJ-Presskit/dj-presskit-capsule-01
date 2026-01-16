"use client";

/**
 * Soundcloud Section
 *
 * Displays SoundCloud tracks in an accordion-style layout.
 * Features:
 * - Accordion cards that expand on hover/click
 * - Responsive: flex-row on desktop, flex-col on mobile
 * - Shows track artwork, title, duration
 * - Links to SoundCloud for each track
 */

import { usePresskit } from "@/context";
import { useI18n } from "@/core/i18n";
import { OutlineTitle } from "@/components/ui/OutlineTitle";
import { SoundcloudContainer } from "@/components/soundcloud";
import { cn } from "@/lib/cn";

// =============================================================================
// Component
// =============================================================================

export function Soundcloud() {
  const { presskit } = usePresskit();
  const { t } = useI18n();

  // Get tracks from presskit
  const tracks = presskit.soundcloud?.tracks ?? [];
  const hasTracks = tracks.length > 0;

  // Don't render if no tracks
  if (!hasTracks) {
    return null;
  }

  return (
    <section
      id="soundcloud"
      className={cn("max-w-[1500px] min-[2500px]:max-w-[1800px] mx-auto", "section-py section-px")}
    >
      {/* Title */}
      <div className="mb-10 lg:mb-14">
        <OutlineTitle
          title="music.soundcloud"
          outlineTitle="music.soundcloudOutline"
          containerClassName="text-center lg:text-left"
        />
      </div>

      {/* Accordion Container */}
      <SoundcloudContainer tracks={tracks} />
    </section>
  );
}

export default Soundcloud;
