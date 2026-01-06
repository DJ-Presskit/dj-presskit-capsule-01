/**
 * Presskit API Client
 * 
 * Router-First Architecture:
 * - Host → slug resolution is done by the external Router
 * - This capsule only fetches presskit data by slug
 */

import { getApiUrl, API_TIMEOUT_MS, REVALIDATE_SECONDS } from "@/core/config";
import { PresskitMinimalSchema, type PresskitMinimal } from "./schemas";
import type { SupportedLang } from "@/core/config";

// ============================================================================
// Types
// ============================================================================

export interface FetchPresskitResult {
  presskit: PresskitMinimal | null;
  error?: string;
  isNotFound?: boolean;
}

// ============================================================================
// Fetch Function
// ============================================================================

/**
 * Fetch presskit data by slug and language
 * 
 * Features:
 * - AbortController timeout (3s)
 * - ISR revalidation (60s)
 * - Zod validation for minimal shape
 * - Returns null on 404 (doesn't throw)
 * 
 * @param slug - DJ slug
 * @param lang - Language code (es|en)
 * @returns FetchPresskitResult with presskit or error
 */
export async function fetchPresskit(
  slug: string,
  lang: SupportedLang
): Promise<FetchPresskitResult> {
  const apiUrl = getApiUrl();
  const url = `${apiUrl}/public/presskits/${encodeURIComponent(slug)}?lang=${lang}`;

  // Create AbortController for timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT_MS);

  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      signal: controller.signal,
      // Next.js ISR caching
      next: { revalidate: REVALIDATE_SECONDS },
    });

    clearTimeout(timeoutId);

    // Handle 404 - return null, don't throw
    if (res.status === 404) {
      return { presskit: null, isNotFound: true };
    }

    // Handle other errors
    if (!res.ok) {
      const text = await res.text().catch(() => "Unknown error");
      return {
        presskit: null,
        error: `API error ${res.status}: ${text}`,
      };
    }

    // Parse and validate response
    const data = await res.json();
    const validated = PresskitMinimalSchema.safeParse(data);

    if (!validated.success) {
      console.error("[fetchPresskit] Validation failed:", validated.error);
      // Return data anyway but log the validation error
      // This allows for forward compatibility with new API fields
      return { presskit: data as PresskitMinimal };
    }

    return { presskit: validated.data };
  } catch (error) {
    clearTimeout(timeoutId);

    // Handle abort (timeout)
    if (error instanceof Error && error.name === "AbortError") {
      return {
        presskit: null,
        error: "Request timeout",
      };
    }

    // Handle other errors
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error(`[fetchPresskit] Error fetching ${slug}:`, message);
    
    return {
      presskit: null,
      error: message,
    };
  }
}
