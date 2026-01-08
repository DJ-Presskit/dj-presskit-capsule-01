/**
 * Capsule 01 - Domain ViewModels
 *
 * Normalized data structures for each section.
 * These are the contracts between normalizers and UI components.
 */

// ============================================================================
// About ViewModel
// ============================================================================

export interface AboutVM {
  shortBio: string | null;
  longBio: string | null;
  genres: string[];
  eventTypes: string | null;
  location: string | null;
  yearsOfExperience: number | null;
  totalEvents: number | null;
  aboutImage: AboutImageVM | null;
  hasContent: boolean;
}

export interface AboutImageVM {
  id: string;
  url: string;
  alt: string;
}

// ============================================================================
// Gallery ViewModel
// ============================================================================

export interface GalleryImageVM {
  id: string;
  url: string;
  alt: string;
  width: number | null;
  height: number | null;
}

export interface GalleryVM {
  images: GalleryImageVM[];
  hasImages: boolean;
  totalCount: number;
}

// ============================================================================
// Events ViewModel
// ============================================================================

export interface EventVM {
  id: string;
  title: string;
  date: Date | null;
  dateFormatted: string;
  venue: string;
  city: string;
  country: string;
  ticketsUrl: string | null;
  isFeatured: boolean;
  eventType: string | null;
  isPast: boolean;
}

export interface EventsVM {
  upcoming: EventVM[];
  past: EventVM[];
  hasUpcoming: boolean;
  hasPast: boolean;
  hasEvents: boolean;
}

// ============================================================================
// Releases ViewModel
// ============================================================================

export interface ReleaseVM {
  id: string;
  title: string;
  releaseDate: Date | null;
  releaseDateFormatted: string | null;
  label: string | null;
  url: string | null;
}

export interface ReleasesVM {
  items: ReleaseVM[];
  hasReleases: boolean;
}

// ============================================================================
// YouTube ViewModel
// ============================================================================

export interface YoutubeVideoVM {
  id: string;
  videoId: string;
  embedUrl: string;
}

export interface YoutubeVM {
  videos: YoutubeVideoVM[];
  hasVideos: boolean;
}

// ============================================================================
// Rider ViewModel
// ============================================================================

export interface RiderItemVM {
  id: string;
  name: string;
  title: string;
  imageUrl: string | null;
  customTitle: string | null;
  note: string | null;
  sortOrder: number;
}

export interface RiderVM {
  items: RiderItemVM[];
  downloadUrl: string | null;
  hasItems: boolean;
}

// ============================================================================
// Socials ViewModel
// ============================================================================

export interface SocialLinkVM {
  id: string;
  platform: string;
  url: string;
  iconUrl: string | null;
}

export interface SocialsVM {
  links: SocialLinkVM[];
  primaryEmail: string | null;
  primaryWhatsapp: string | null;
  hasLinks: boolean;
  hasContact: boolean;
}

// ============================================================================
// Contact ViewModel
// ============================================================================

export interface ContactVM {
  email: string | null;
  whatsapp: string | null;
  driveUrl: string | null;
  hasContact: boolean;
}

// ============================================================================
// Complete Page ViewModel
// ============================================================================

export interface PresskitPageVM {
  slug: string;
  artistName: string;
  about: AboutVM;
  gallery: GalleryVM;
  events: EventsVM;
  releases: ReleasesVM;
  youtube: YoutubeVM;
  rider: RiderVM;
  socials: SocialsVM;
  contact: ContactVM;
}
