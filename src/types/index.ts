/**
 * Types for dj-presskit-capsule-core
 * Comprehensive types matching API responses
 */

// ============================================================================
// Status Types
// ============================================================================

export type DjStatus = "ACTIVE" | "PAUSED" | "IN_SETUP" | "DELETED";
export type PublicMode = "ACTIVE" | "GRACE" | "INACTIVE";

// ============================================================================
// Language Types
// ============================================================================

export type SupportedLang = "es" | "en";
export const DEFAULT_LANG: SupportedLang = "es";
export const SUPPORTED_LANGS: SupportedLang[] = ["es", "en"];

// ============================================================================
// Presskit Sub-Types
// ============================================================================

export interface EventView {
  id: string;
  title: string;
  date: string;
  venue: string;
  city: string;
  country: string;
  ticketsUrl?: string;
  isFeatured: boolean;
  eventType?: string;
}

export interface ReleaseView {
  id: string;
  title: string;
  releaseDate: string | null;
  label?: string;
  url?: string;
}

export interface SoundcloudTrackView {
  id: number;
  title: string;
  permalinkUrl: string;
  artworkUrl?: string;
  durationMs: number;
}

export interface GalleryImageView {
  id: string;
  url: string;
  alt?: string;
  width?: number;
  height?: number;
}

export interface TechnicalRiderItemView {
  id: string;
  name: string;
  title: string;
  imageUrl: string;
  customTitle?: string;
  note?: string;
  sortOrder: number;
}

/**
 * Favicon set with all required sizes for browser/PWA icons
 */
export interface FaviconSet {
  icon16: string;
  icon32: string;
  icon48: string;
  apple180: string;
  icon192: string;
  icon512: string;
  version: string;
}

export interface PresskitSeo {
  canonicalUrl?: string;
  title?: string;
  description?: string;
  keywords?: string[];
  ogImageUrl?: string;
  ogImageWidth?: number;
  ogImageHeight?: number;
  faviconSet?: FaviconSet;
}

export interface PresskitProfile {
  shortBio?: string;
  longBio?: string;
  location?: string;
  eventTypes?: string;
  yearsOfExperience?: number;
  totalEvents?: number;
  genres?: string[];
}

export interface PresskitTheme {
  accentColor: string;
  backgroundTint?: string | null;
  background?: {
    mode?: "preset" | "image" | "video" | "none";
    presetId?: string;
    presetConfig?: Record<string, unknown>;
    imageUrl?: string;
    videoUrl?: string;
    posterUrl?: string;
    overlayOpacity?: number;
    cloudflareStreamId?: string;
  };
  heroPresentation?: "cutout" | "background";
  branding?: {
    homeTitleMode?: "TEXT" | "LOGO";
    homeLogo?: {
      cloudflareId?: string;
      url?: string;
    };
  };
  /** Hero video Cloudflare Stream UID (CAPSULE_01 only) */
  heroVideoCloudflareId?: string;
  /** Hero media type (CAPSULE_01 only) */
  heroMediaType?: "video" | "image" | "none";
}

export interface PresskitContact {
  primaryEmail?: string;
  primaryWhatsapp?: string;
  channels: {
    platform: string;
    url: string;
    iconUrl?: string;
  }[];
}

export interface PresskitMedia {
  hero?: { id: string; url: string; sortOrder: number };
  logo?: {
    originalUrl: string;
    width: number;
    height: number;
    format: string;
    hasAlpha: boolean;
    updatedAt: string;
    version: string;
    alt?: string;
  };
  gallery: { id: string; url: string; sortOrder: number }[];
  about: { id: string; url: string; sortOrder: number };
}

// ============================================================================
// Readiness Types
// ============================================================================

/**
 * Readiness status for presskit rendering validation
 * Used to determine if a presskit has all required content
 */
export interface PresskitReadiness {
  isReady: boolean;
  missingFields: string[];
}

// ============================================================================
// Main Presskit Type
// ============================================================================

/**
 * Complete presskit view for rendering
 * Uses index signature for extensibility
 */
export interface PresskitPublicView {
  id: string;
  slug: string;
  artistName: string;
  status: DjStatus;
  publicMode?: PublicMode;
  driveUrl?: string;
  theme?: PresskitTheme;
  profile?: PresskitProfile;
  contact?: PresskitContact;
  media?: PresskitMedia;
  events?: {
    past: EventView[];
    upcoming: EventView[];
  };
  releases?: {
    upcoming: ReleaseView[];
  };
  soundcloud?: {
    profileUrl?: string;
    tracks: SoundcloudTrackView[];
  };
  youtube?: {
    videos: string[];
  };
  technicalRider?: {
    items: TechnicalRiderItemView[];
  };
  seo?: PresskitSeo;
  readiness?: PresskitReadiness;
  updatedAt?: string;
  // Allow additional properties from API
  [key: string]: unknown;
}

// ============================================================================
// Tenant Resolution Types (for Router)
// ============================================================================

export interface TenantResolveResponse {
  slug: string;
  canonicalHost: string;
  templateKey: string;
  publicMode: PublicMode;
  presskitUpdatedAt: string;
  status: DjStatus;
}
