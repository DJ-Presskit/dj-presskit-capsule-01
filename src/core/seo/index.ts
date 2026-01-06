/**
 * SEO Helpers and Defaults
 * 
 * Comprehensive SEO utilities for dynamic metadata generation
 */

import type { Locale } from "@/core/i18n";
import { DEFAULT_OG_IMAGE, DEFAULT_FAVICON_SET, DEFAULT_METADATA, getFaviconSet } from "./defaults";

// Re-export defaults and canonical helpers
export * from "./defaults";
export * from "./canonical";

// ============================================================================
// URL Builders (SPA-aware: exclude section paths from canonical)
// ============================================================================

interface CanonicalUrlParams {
  canonicalHost: string;
  lang: Locale;
  /** @deprecated - restPath is ignored for SPA canonical URLs */
  restPath?: string[];
}

interface AlternateLanguagesParams {
  canonicalHost: string;
  /** @deprecated - restPath is ignored for SPA canonical URLs */
  restPath?: string[];
}

/**
 * Build absolute canonical URL for SPA.
 * NOTE: restPath is intentionally IGNORED to prevent duplicate content indexing.
 * All section deep links should point to the base page canonical.
 */
export function buildCanonicalUrl({
  canonicalHost,
  lang,
  restPath: _restPath, // Ignored for SPA
}: CanonicalUrlParams): string {
  const base = canonicalHost.replace(/\/$/, "");
  // SPA: Do NOT include section path in canonical
  return `${base}/${lang}`;
}

/**
 * Build alternate language URLs for SEO hreflang tags.
 * NOTE: restPath is intentionally IGNORED to prevent duplicate content indexing.
 */
export function buildAlternateLanguages({
  canonicalHost,
  restPath: _restPath, // Ignored for SPA
}: AlternateLanguagesParams): Record<string, string> {
  const base = canonicalHost.replace(/\/$/, "");
  // SPA: Do NOT include section path in alternates

  return {
    es: `${base}/es`,
    en: `${base}/en`,
    "x-default": `${base}/es`,
  };
}

// ============================================================================
// Robots Meta
// ============================================================================

/**
 * Determine robots meta value based on presskit status
 */
export function getRobotsValue(options: {
  status?: string;
  publicMode?: string;
  isError?: boolean;
}): string {
  const { status, publicMode, isError } = options;

  if (isError) return "noindex, nofollow";
  if (status === "DELETED") return "noindex, nofollow";
  if (publicMode === "INACTIVE") return "noindex, nofollow";
  if (status === "PAUSED") return "noindex, nofollow";

  return "index, follow";
}

/**
 * Get full robots metadata object for Next.js
 */
export function getRobotsMetadata(options: {
  status?: string;
  publicMode?: string;
  isError?: boolean;
}) {
  const shouldIndex = !options.isError && 
    options.status !== "DELETED" && 
    options.status !== "PAUSED" && 
    options.publicMode !== "INACTIVE";

  return {
    index: shouldIndex,
    follow: shouldIndex,
    nocache: false,
    googleBot: {
      index: shouldIndex,
      follow: shouldIndex,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large" as const,
      "max-snippet": -1,
    },
  };
}

// ============================================================================
// Icons Metadata Builder
// ============================================================================

interface SeoFaviconSet {
  icon16?: string;
  icon32?: string;
  icon48?: string;
  apple180?: string;
  icon192?: string;
  icon512?: string;
}

/**
 * Build icons metadata for Next.js
 */
export function buildIconsMetadata(faviconSet?: SeoFaviconSet | null) {
  const favicons = getFaviconSet(faviconSet);

  return {
    icon: [
      { url: favicons.icon16, sizes: "16x16", type: "image/png" },
      { url: favicons.icon32, sizes: "32x32", type: "image/png" },
      { url: favicons.icon48, sizes: "48x48", type: "image/png" },
      { url: favicons.icon192, sizes: "192x192", type: "image/png" },
    ],
    apple: [
      { url: favicons.apple180, sizes: "180x180", type: "image/png" },
    ],
    shortcut: [
      { url: favicons.icon32, type: "image/png" },
    ],
  };
}

// ============================================================================
// OG Image Builder
// ============================================================================

interface OgImageOptions {
  url?: string | null;
  width?: number | null;
  height?: number | null;
  alt: string;
}

/**
 * Build OpenGraph images array with defaults
 */
export function buildOgImages(options: OgImageOptions) {
  const url = options.url || DEFAULT_OG_IMAGE.url;
  const width = options.width || DEFAULT_OG_IMAGE.width;
  const height = options.height || DEFAULT_OG_IMAGE.height;

  return [
    {
      url,
      secureUrl: url.startsWith("http") ? url : undefined,
      width,
      height,
      alt: options.alt,
      type: "image/png",
    },
  ];
}
