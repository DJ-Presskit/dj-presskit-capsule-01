/**
 * i18n System for UI labels
 * 
 * NOTE: This does NOT translate DJ content (that comes from API)
 * Only UI labels, navigation, and error messages
 */

import es from "./dictionaries/es";
import en from "./dictionaries/en";

export const LOCALES = ["es", "en"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "es";

/**
 * Dictionary structure type
 */
export interface Dictionary {
  common: {
    gallery: string;
    seeMore: string;
    pressMaterial: string;
    loading: string;
    error: string;
  };
  nav: {
    bio: string;
    nextDates: string;
    music: string;
    gallery: string;
    rider: string;
    contact: string;
  };
  about: {
    title: string;
    locationLabel: string;
    eventTypesLabel: string;
    yearsOfExperience: string;
    totalEvents: string;
    genres: string;
  };
  events: {
    default: string;
    tba: string;
    next: string;
    past: string;
    noEvents: string;
  };
  music: {
    lastReleases: string;
    listenOn: string;
    noReleases: string;
  };
  gallery: {
    title: string;
    photos: string;
    noPhotos: string;
    download: string;
  };
  rider: {
    title: string;
    noRider: string;
    download: string;
  };
  contact: {
    title: string;
    description: string;
    bookingLabel: string;
    pressLabel: string;
  };
  footer: {
    allRightsReserved: string;
    copyright: string;
  };
  errors: {
    notFound: string;
    notFoundMessage: string;
    gone: string;
    goneMessage: string;
    backHome: string;
  };
}

const dictionaries: Record<Locale, Dictionary> = { es, en };

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
