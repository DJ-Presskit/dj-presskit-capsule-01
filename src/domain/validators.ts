/**
 * Capsule 01 - Validation Utilities
 *
 * Pure functions for URL validation, date parsing, and data normalization.
 * All functions are safe and will never throw.
 */

// ============================================================================
// URL Validation
// ============================================================================

/**
 * Check if a URL is valid (http/https only)
 */
export function isValidUrl(url: unknown): url is string {
  if (typeof url !== "string" || !url.trim()) return false;

  try {
    const parsed = new URL(url.trim());
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

/**
 * Safely normalize a URL: trim whitespace, validate, return null if invalid
 */
export function safeUrl(url: unknown): string | null {
  if (!isValidUrl(url)) return null;
  return url.trim();
}

/**
 * Extract YouTube video ID from various URL formats
 */
export function extractYoutubeId(input: unknown): string | null {
  if (typeof input !== "string" || !input.trim()) return null;

  const trimmed = input.trim();

  // If it's already just an ID (11 characters, alphanumeric + _ -)
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }

  try {
    const url = new URL(trimmed);

    // youtube.com/watch?v=ID
    if (url.hostname.includes("youtube.com")) {
      const id = url.searchParams.get("v");
      if (id && /^[a-zA-Z0-9_-]{11}$/.test(id)) {
        return id;
      }
    }

    // youtu.be/ID
    if (url.hostname === "youtu.be") {
      const id = url.pathname.slice(1);
      if (/^[a-zA-Z0-9_-]{11}$/.test(id)) {
        return id;
      }
    }

    // youtube.com/embed/ID
    if (url.pathname.startsWith("/embed/")) {
      const id = url.pathname.replace("/embed/", "").split("/")[0];
      if (/^[a-zA-Z0-9_-]{11}$/.test(id)) {
        return id;
      }
    }
  } catch {
    // Not a valid URL, but might be an ID
    return null;
  }

  return null;
}

// ============================================================================
// Date Parsing
// ============================================================================

/**
 * Safely parse a date string into a Date object.
 * Returns null for invalid dates.
 */
export function parseDate(dateStr: unknown): Date | null {
  if (typeof dateStr !== "string" || !dateStr.trim()) return null;

  try {
    const date = new Date(dateStr.trim());
    // Check for invalid date
    if (isNaN(date.getTime())) return null;
    return date;
  } catch {
    return null;
  }
}

/**
 * Format a date for display (locale-aware)
 */
export function formatDate(date: Date | null, locale: string = "es"): string {
  if (!date) return "";

  try {
    return date.toLocaleDateString(locale === "en" ? "en-US" : "es-AR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "";
  }
}

/**
 * Check if a date is in the past (comparing to today)
 */
export function isPastDate(date: Date | null): boolean {
  if (!date) return false;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return date < today;
}

/**
 * Sort items by date field
 */
export function sortByDate<T>(
  items: T[],
  getDate: (item: T) => Date | null,
  order: "asc" | "desc" = "asc",
): T[] {
  return [...items].sort((a, b) => {
    const dateA = getDate(a);
    const dateB = getDate(b);

    // Null dates go to the end
    if (!dateA && !dateB) return 0;
    if (!dateA) return 1;
    if (!dateB) return -1;

    const diff = dateA.getTime() - dateB.getTime();
    return order === "asc" ? diff : -diff;
  });
}

// ============================================================================
// String Utilities
// ============================================================================

/**
 * Safely trim a string, return fallback if empty/invalid
 */
export function trimString(str: unknown, fallback: string | null = null): string | null {
  if (typeof str !== "string") return fallback;
  const trimmed = str.trim();
  return trimmed.length > 0 ? trimmed : fallback;
}

/**
 * Truncate string to max length with ellipsis
 */
export function truncate(str: string | null, maxLength: number): string {
  if (!str) return "";
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength).trim() + "...";
}

// ============================================================================
// Array Utilities
// ============================================================================

/**
 * Clamp array to max length
 */
export function clampArray<T>(arr: T[] | undefined | null, max: number): T[] {
  if (!Array.isArray(arr)) return [];
  return arr.slice(0, max);
}

/**
 * Generate a stable key from an item
 * Uses id if available, otherwise creates hash from index + content
 */
export function generateStableKey(
  item: { id?: string | number } | string | number,
  index: number,
): string {
  if (typeof item === "string") return `str-${index}-${item.slice(0, 10)}`;
  if (typeof item === "number") return `num-${index}-${item}`;
  if (item && typeof item === "object" && "id" in item && item.id) {
    return String(item.id);
  }
  return `idx-${index}`;
}

/**
 * Filter out items with invalid or duplicate IDs
 */
export function dedupeById<T extends { id: string }>(items: T[]): T[] {
  const seen = new Set<string>();
  return items.filter((item) => {
    if (!item.id || seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });
}
