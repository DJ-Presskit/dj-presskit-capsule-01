/**
 * SEO Defaults and Constants
 * 
 * Default DJ Presskit assets used as fallbacks when presskit
 * doesn't have custom SEO assets configured
 */

// ============================================================================
// Default OG Image
// ============================================================================

export const DEFAULT_OG_IMAGE = {
  url: "/og_image.png",
  width: 1200,
  height: 630,
  alt: "DJ Presskit",
  type: "image/png",
} as const;

// ============================================================================
// Default Favicon Set
// ============================================================================

export const DEFAULT_FAVICON_SET = {
  icon16: "/logos/16x16.png",
  icon32: "/logos/32x32.png",
  icon48: "/logos/48x48.png",
  apple180: "/logos/180x180.png",
  icon192: "/logos/192x192.png",
  icon512: "/logos/512x512.png",
  ico: "/logos/favicon.ico",
} as const;

// ============================================================================
// Default Metadata Values
// ============================================================================

export const DEFAULT_METADATA = {
  siteName: "DJ Presskit",
  publisher: "DJ Presskit",
  category: "Music",
  applicationName: "DJ Presskit",
  tileColor: "#050505",
} as const;

// ============================================================================
// Types
// ============================================================================

export interface FaviconSet {
  icon16: string;
  icon32: string;
  icon48: string;
  apple180: string;
  icon192: string;
  icon512: string;
}

/**
 * Get favicon set with defaults
 */
export function getFaviconSet(customSet?: Partial<FaviconSet> | null): FaviconSet {
  return {
    icon16: customSet?.icon16 || DEFAULT_FAVICON_SET.icon16,
    icon32: customSet?.icon32 || DEFAULT_FAVICON_SET.icon32,
    icon48: customSet?.icon48 || DEFAULT_FAVICON_SET.icon48,
    apple180: customSet?.apple180 || DEFAULT_FAVICON_SET.apple180,
    icon192: customSet?.icon192 || DEFAULT_FAVICON_SET.icon192,
    icon512: customSet?.icon512 || DEFAULT_FAVICON_SET.icon512,
  };
}
