/**
 * About Section Normalizer
 */

import type { AboutVM, AboutImageVM } from "../types";
import { trimString, clampArray, safeUrl } from "../validators";

interface AboutDTO {
  profile?: {
    shortBio?: string;
    longBio?: string;
    genres?: string[];
    eventTypes?: string;
    location?: string;
    yearsOfExperience?: number;
    totalEvents?: number;
  };
  media?: {
    about?: {
      image1?: { id: string; url: string; sortOrder: number };
      image2?: { id: string; url: string; sortOrder: number };
    };
  };
}

const MAX_GENRES = 5;

export function normalizeAbout(dto: AboutDTO | null | undefined): AboutVM {
  const profile = dto?.profile;
  const aboutMedia = dto?.media?.about;

  // Normalize about image (use image1 as primary)
  let aboutImage: AboutImageVM | null = null;
  if (aboutMedia?.image1) {
    const url = safeUrl(aboutMedia.image1.url);
    if (url) {
      aboutImage = {
        id: aboutMedia.image1.id || "about-img-1",
        url,
        alt: "About image",
      };
    }
  }

  const shortBio = trimString(profile?.shortBio);
  const longBio = trimString(profile?.longBio);
  const genres = clampArray(
    profile?.genres?.filter((g) => typeof g === "string" && g.trim()),
    MAX_GENRES,
  );
  const eventTypes = trimString(profile?.eventTypes);
  const location = trimString(profile?.location);
  const yearsOfExperience =
    typeof profile?.yearsOfExperience === "number" ? profile.yearsOfExperience : null;
  const totalEvents = typeof profile?.totalEvents === "number" ? profile.totalEvents : null;

  const hasContent = Boolean(shortBio || longBio || genres.length > 0 || location || aboutImage);

  return {
    shortBio,
    longBio,
    genres,
    eventTypes,
    location,
    yearsOfExperience,
    totalEvents,
    aboutImage,
    hasContent,
  };
}
