"use client";

/**
 * SectionSentinel - Visibility tracking for background sections
 *
 * Places a 1px invisible div in each section that uses the background.
 * When the sentinel enters viewport → registers section as active.
 * When no sentinels visible → background pauses.
 *
 * This pattern avoids the Safari trap where fixed elements are always "visible".
 */

import { useEffect, useRef } from "react";
import { useBackgroundContext } from "./BackgroundContext";

interface SectionSentinelProps {
  /** Unique section identifier */
  sectionId: string;
  /** Background preset to activate when visible */
  preset: string;
  /** Preset configuration */
  config?: Record<string, unknown>;
  /** IntersectionObserver threshold (default 0.1) */
  threshold?: number;
}

export function SectionSentinel({
  sectionId,
  preset,
  config,
  threshold = 0.1,
}: SectionSentinelProps) {
  const { setPreset, registerSection, unregisterSection } = useBackgroundContext();
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = sentinelRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          registerSection(sectionId);
          setPreset(preset, config);
        } else {
          unregisterSection(sectionId);
        }
      },
      { threshold },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [sectionId, preset, config, threshold, setPreset, registerSection, unregisterSection]);

  // Render invisible sentinel that spans the section
  return (
    <div
      ref={sentinelRef}
      className="absolute inset-0 pointer-events-none"
      style={{ height: "1px" }}
      aria-hidden="true"
    />
  );
}

export default SectionSentinel;
