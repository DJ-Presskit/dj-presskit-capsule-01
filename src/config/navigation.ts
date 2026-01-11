/**
 * Navigation Configuration
 *
 * Centralized navigation routes that connect Nav component with sections.
 * Single source of truth for section IDs, labels, and routes.
 */

// ============================================================================
// Types
// ============================================================================

export interface NavSection {
  /** Unique section ID - matches the id="" attribute on section elements */
  id: string;
  /** Display labels by language */
  labels: {
    es: string;
    en: string;
  };
  /** Whether this section is enabled by default */
  defaultEnabled: boolean;
}

export type SupportedLang = "es" | "en";

// ============================================================================
// Section Configuration
// ============================================================================

/**
 * All available navigation sections.
 * The `id` must match the section's `id` attribute in the corresponding component.
 */
export const NAV_SECTIONS: NavSection[] = [
  {
    id: "about",
    labels: { es: "BIO", en: "BIO" },
    defaultEnabled: true,
  },
  {
    id: "events",
    labels: { es: "EVENTOS", en: "EVENTS" },
    defaultEnabled: true,
  },
  {
    id: "releases",
    labels: { es: "MÚSICA", en: "MUSIC" },
    defaultEnabled: true,
  },
  {
    id: "rider",
    labels: { es: "RIDER", en: "RIDER" },
    defaultEnabled: true,
  },
  {
    id: "socials",
    labels: { es: "CONTACTO", en: "CONTACT" },
    defaultEnabled: true,
  },
  // Optional sections (disabled by default)
  {
    id: "youtube",
    labels: { es: "YOUTUBE", en: "YOUTUBE" },
    defaultEnabled: false,
  },
  {
    id: "gallery",
    labels: { es: "GALERÍA", en: "GALLERY" },
    defaultEnabled: false,
  },
];

/**
 * Section IDs that are always available (non-toggleable)
 */
export const ALWAYS_VISIBLE_SECTIONS = ["about", "contact"];

// ============================================================================
// Helpers
// ============================================================================

/**
 * Get section label by ID and language
 */
export function getSectionLabel(sectionId: string, lang: SupportedLang): string {
  const section = NAV_SECTIONS.find((s) => s.id === sectionId);
  return section?.labels[lang] || sectionId.toUpperCase();
}

/**
 * Get all default-enabled section IDs
 */
export function getDefaultSectionIds(): string[] {
  return NAV_SECTIONS.filter((s) => s.defaultEnabled).map((s) => s.id);
}

/**
 * Build navigation href for a section
 */
export function buildSectionHref(
  sectionId: string,
  lang: SupportedLang,
  options: { slug?: string; isProxied?: boolean } = {},
): string {
  const { slug, isProxied = false } = options;
  const base = isProxied ? `/${lang}` : `/t/${slug}/${lang}`;
  return `${base}#${sectionId}`;
}

/**
 * Get sections filtered by enabled IDs
 */
export function getEnabledSections(enabledIds?: string[]): NavSection[] {
  if (!enabledIds) {
    return NAV_SECTIONS.filter((s) => s.defaultEnabled);
  }
  return NAV_SECTIONS.filter((s) => enabledIds.includes(s.id));
}
