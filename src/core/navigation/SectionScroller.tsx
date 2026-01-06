"use client";

import { useEffect, useRef } from "react";
import type { SectionKey } from "./sections";
import { getSectionId } from "./sections";

interface SectionScrollerProps {
  /**
   * The section to scroll to on mount
   */
  initialSection: SectionKey | null;
}

/**
 * SectionScroller
 *
 * Client component that scrolls to a section on mount.
 * Uses smooth scrolling unless prefers-reduced-motion is enabled.
 */
export function SectionScroller({ initialSection }: SectionScrollerProps) {
  const hasScrolled = useRef(false);

  useEffect(() => {
    if (!initialSection || hasScrolled.current) return;

    // Wait for layout stabilization
    const timeoutId = requestAnimationFrame(() => {
      const sectionId = getSectionId(initialSection);
      const element = document.getElementById(sectionId);

      if (element) {
        // Check for reduced motion preference
        const prefersReducedMotion = window.matchMedia(
          "(prefers-reduced-motion: reduce)"
        ).matches;

        element.scrollIntoView({
          behavior: prefersReducedMotion ? "auto" : "smooth",
          block: "start",
        });

        hasScrolled.current = true;
      }
    });

    return () => {
      cancelAnimationFrame(timeoutId);
    };
  }, [initialSection]);

  // This component renders nothing
  return null;
}

export default SectionScroller;
