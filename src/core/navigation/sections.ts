/**
 * Navigation - Sections Registry
 *
 * Centralized section definitions for SPA deep linking.
 * Sections are path segments that scroll to DOM elements.
 */

// ============================================================================
// Section Keys (as const for type safety)
// ============================================================================

export const SECTION_KEYS = [
  "about",
  "events",
  "releases",
  "soundcloud",
  "youtube",
  "gallery",
  "technical-rider",
  "contact",
] as const;

export type SectionKey = (typeof SECTION_KEYS)[number];

// ============================================================================
// Normalization
// ============================================================================

// NOTE: SECTION_ALIASES removed to prevent URL pollution in proxied domains.
// Navigation should use direct section keys or native anchors (#{section}).

/**
 * Normalize a path segment to a known section key
 * Returns null if not a valid section (no alias mapping)
 */
export function normalizeSectionKey(rest?: string[] | null): SectionKey | null {
  if (!rest || rest.length === 0) return null;

  const segment = rest[0].toLowerCase().trim();

  // Direct match only (no aliases)
  if (SECTION_KEYS.includes(segment as SectionKey)) {
    return segment as SectionKey;
  }

  return null;
}

/**
 * Check if a section key is valid
 */
export function isValidSection(key: string): key is SectionKey {
  return SECTION_KEYS.includes(key as SectionKey);
}

// ============================================================================
// Path Builders
// ============================================================================

interface BuildSectionPathParams {
  slug: string;
  lang: string;
  section?: SectionKey | null;
}

/**
 * Build a path to a specific section
 */
export function buildSectionPath({
  slug,
  lang,
  section,
  isProxied,
}: BuildSectionPathParams & { isProxied?: boolean }): string {
  // Clean URL for proxied requests (custom domains)
  if (isProxied) {
    const basePath = `/${lang}`;
    if (!section) return basePath;
    return `${basePath}/${section}`;
  }

  // Technical URL for direct capsule access
  const basePath = `/t/${slug}/${lang}`;
  if (!section) return basePath;
  return `${basePath}/${section}`;
}

/**
 * Get the DOM element ID for a section
 * Usually the section key itself, but can be customized
 */
export function getSectionId(section: SectionKey): string {
  return section;
}

// ============================================================================
// Barrel Export
// ============================================================================

export { SECTION_KEYS as default };
