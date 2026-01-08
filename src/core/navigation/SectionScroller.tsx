/**
 * SectionScroller - DISABLED
 *
 * Previously used for auto-scrolling to sections on mount.
 * Disabled to prevent URL pollution in proxied domains.
 *
 * Navigation should use native anchors (#{section}) instead.
 */

import type { SectionKey } from "./sections";

interface SectionScrollerProps {
  initialSection: SectionKey | null;
}

/**
 * SectionScroller - Now a no-op component
 * Kept for backward compatibility with existing imports.
 */
export function SectionScroller(_props: SectionScrollerProps) {
  // NOTE: Auto-scroll disabled to prevent URL pollution.
  // Use native browser anchor scrolling instead: <a href="#section">
  return null;
}

export default SectionScroller;
