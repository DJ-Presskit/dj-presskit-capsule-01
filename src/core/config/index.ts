/**
 * Config module - Application constants and configuration
 */

// ============================================================================
// API Configuration
// ============================================================================

export function getApiUrl(): string {
  const url = process.env.NEXT_PUBLIC_DJ_PRESSKIT_API_URL;
  if (!url) {
    throw new Error(
      "[dj-presskit-capsule-core] NEXT_PUBLIC_DJ_PRESSKIT_API_URL is not set. " +
        "Please add it to your .env.local file."
    );
  }
  // Remove trailing slash if present
  return url.replace(/\/$/, "");
}

// ============================================================================
// Timeouts
// ============================================================================

/** API fetch timeout in ms (increased for slow API responses) */
export const API_TIMEOUT_MS = 15000;

/** ISR revalidation period in seconds (15min prod, 0 dev) */
export const REVALIDATE_SECONDS = process.env.NODE_ENV === "production" ? 900 : 0;

// ============================================================================
// Theme Defaults
// ============================================================================

export const DEFAULT_ACCENT_COLOR = "#59C6BA";

// ============================================================================
// Supported Languages
// ============================================================================

export const SUPPORTED_LANGS = ["es", "en"] as const;
export type SupportedLang = (typeof SUPPORTED_LANGS)[number];
export const DEFAULT_LANG: SupportedLang = "es";
