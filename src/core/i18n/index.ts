/**
 * i18n System for UI labels
 *
 * NOTE: This does NOT translate DJ content (that comes from API)
 * Only UI labels, navigation, and error messages
 *
 * Usage:
 * ```tsx
 * import { useI18n } from "@/core/i18n";
 *
 * function MyComponent() {
 *   const { t } = useI18n();
 *   return <h1>{t("about.title")}</h1>;
 * }
 * ```
 */

import es from "./dictionaries/es";
import en from "./dictionaries/en";
import { usePresskit } from "@/context";

// ============================================================================
// Types & Constants
// ============================================================================

export const LOCALES = ["es", "en"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "es";

/** Dynamic dictionary type - no strict interface for flexibility */
export type Dictionary = Record<string, Record<string, string>>;

const dictionaries: Record<Locale, Dictionary> = { es, en };

// ============================================================================
// Core Functions
// ============================================================================

/**
 * Get dictionary for locale
 */
export function getDictionary(locale: Locale | string): Dictionary {
  const normalized = LOCALES.includes(locale as Locale) ? (locale as Locale) : DEFAULT_LOCALE;
  return dictionaries[normalized];
}

/**
 * Validate locale string
 */
export function isValidLocale(locale: string): locale is Locale {
  return LOCALES.includes(locale as Locale);
}

/**
 * Get normalized locale with fallback
 */
export function normalizeLocale(locale: string | undefined): Locale {
  if (!locale) return DEFAULT_LOCALE;
  return isValidLocale(locale) ? locale : DEFAULT_LOCALE;
}

/**
 * Create a translator function for a specific locale
 *
 * @param locale - The locale to use
 * @returns t() function that translates keys like "section.key"
 */
export function createTranslator(locale: Locale | string) {
  const dict = getDictionary(locale);

  return function t(key: string): string {
    const parts = key.split(".");
    if (parts.length !== 2) return key;

    const [section, subkey] = parts;
    return dict[section]?.[subkey] ?? key;
  };
}

// ============================================================================
// React Hook
// ============================================================================

/**
 * Hook to get translations in React components
 *
 * Uses the locale from PresskitContext
 *
 * @example
 * const { t, locale } = useI18n();
 * return <h1>{t("about.title")}</h1>;
 */
export function useI18n() {
  const { lang } = usePresskit();
  const normalizedLocale = normalizeLocale(lang);
  const t = createTranslator(normalizedLocale);

  return {
    t,
    locale: normalizedLocale,
    dictionary: getDictionary(normalizedLocale),
  };
}
