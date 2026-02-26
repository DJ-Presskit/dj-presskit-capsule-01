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
    id: "youtube",
    labels: { es: "YOUTUBE", en: "YOUTUBE" },
    defaultEnabled: true,
  },
  {
    id: "rider",
    labels: { es: "RIDER", en: "RIDER" },
    defaultEnabled: true,
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
 * Get sections filtered by enabled IDs and data presence
 */
export function getEnabledSections(
  presskit: any,
  enabledIds?: string[],
): NavSection[] {
  const sections = enabledIds
    ? NAV_SECTIONS.filter((s) => enabledIds.includes(s.id))
    : NAV_SECTIONS.filter((s) => s.defaultEnabled);

  return sections.filter((section) => {
    switch (section.id) {
      case "about":
        return true; // Bio is usually mandatory or at least placeholder
      case "events":
        return (
          (presskit.events?.upcoming?.length ?? 0) > 0 ||
          (presskit.events?.past?.length ?? 0) > 0
        );
      case "releases":
        return (presskit.releases?.upcoming?.length ?? 0) > 0;
      case "youtube":
        return (presskit.youtube?.videos?.length ?? 0) > 0;
      case "rider":
        return (presskit.technicalRider?.items?.length ?? 0) > 0;
      case "soundcloud":
        return (presskit.soundcloud?.tracks?.length ?? 0) > 0;
      case "gallery":
        return (presskit.media?.gallery?.length ?? 0) >= 4;
      default:
        return true;
    }
  });
}
