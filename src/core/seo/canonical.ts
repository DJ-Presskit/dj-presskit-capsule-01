/**
 * Canonical Origin Detection
 * 
 * Utilities for determining the canonical origin from request headers.
 * Priority: x-canonical-host > x-forwarded-* > host > env fallback
 */

import { headers } from "next/headers";

// ============================================================================
// Get Canonical Origin from Headers
// ============================================================================

/**
 * Get the canonical origin for the current request.
 * 
 * Priority:
 * 1. x-canonical-host (if router provides it)
 * 2. x-forwarded-proto + x-forwarded-host
 * 3. host header
 * 4. NEXT_PUBLIC_SITE_URL env variable
 * 5. localhost fallback for dev
 */
export async function getCanonicalOrigin(): Promise<string> {
  const headersList = await headers();
  
  // 1. Check for router-provided canonical host
  const canonicalHost = headersList.get("x-canonical-host");
  if (canonicalHost) {
    // Ensure it has protocol
    if (canonicalHost.startsWith("http")) {
      return canonicalHost.replace(/\/$/, "");
    }
    return `https://${canonicalHost}`.replace(/\/$/, "");
  }
  
  // 2. Check x-forwarded headers
  const forwardedProto = headersList.get("x-forwarded-proto") || "https";
  const forwardedHost = headersList.get("x-forwarded-host");
  if (forwardedHost) {
    return `${forwardedProto}://${forwardedHost}`.replace(/\/$/, "");
  }
  
  // 3. Check host header
  const host = headersList.get("host");
  if (host && !host.includes("localhost")) {
    return `https://${host}`.replace(/\/$/, "");
  }
  
  // 4. Check env variable
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (siteUrl) {
    return siteUrl.replace(/\/$/, "");
  }
  
  // 5. Fallback for development
  if (host) {
    return `http://${host}`.replace(/\/$/, "");
  }
  
  return "http://localhost:3000";
}

// ============================================================================
// Build Canonical Base URL (without section paths)
// ============================================================================

interface CanonicalBaseUrlParams {
  origin: string;
  slug: string;
  lang: string;
}

/**
 * Build canonical base URL for SPA.
 * IMPORTANT: Does NOT include section paths to avoid duplicate content.
 */
export function buildCanonicalBaseUrl({
  origin,
  slug,
  lang,
}: CanonicalBaseUrlParams): string {
  const cleanOrigin = origin.replace(/\/$/, "");
  return `${cleanOrigin}/${lang}`;
}

/**
 * Build alternate language URLs for SPA.
 * IMPORTANT: Does NOT include section paths to avoid duplicate content.
 */
export function buildAlternateBaseUrls(origin: string): Record<string, string> {
  const cleanOrigin = origin.replace(/\/$/, "");
  
  return {
    es: `${cleanOrigin}/es`,
    en: `${cleanOrigin}/en`,
    "x-default": `${cleanOrigin}/es`,
  };
}
