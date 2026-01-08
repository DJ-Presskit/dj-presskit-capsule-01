/**
 * Capsule 01 - Data Aggregator
 *
 * Server-side function that normalizes the full presskit DTO
 * into ViewModels for each section.
 */

import type { PresskitPageVM } from "./types";
import { normalizeAbout } from "./about/normalize";
import { normalizeGallery } from "./gallery/normalize";
import { normalizeEvents } from "./events/normalize";
import { normalizeReleases } from "./releases/normalize";
import { normalizeYoutube } from "./youtube/normalize";
import { normalizeRider } from "./rider/normalize";
import { normalizeSocials } from "./socials/normalize";
import { normalizeContact } from "./contact/normalize";
import { trimString } from "./validators";

/**
 * Transform raw presskit DTO into normalized ViewModels for all sections.
 * This is the single entry point for data normalization.
 *
 * @param presskit - Raw presskit data from API
 * @returns PresskitPageVM with all sections normalized
 */
export function getPresskitData(
  presskit: Record<string, unknown> | null | undefined,
): PresskitPageVM {
  if (!presskit) {
    // Return empty page VM
    return {
      slug: "",
      artistName: "",
      about: normalizeAbout(null),
      gallery: normalizeGallery(null),
      events: normalizeEvents(null),
      releases: normalizeReleases(null),
      youtube: normalizeYoutube(null),
      rider: normalizeRider(null),
      socials: normalizeSocials(null),
      contact: normalizeContact(null),
    };
  }

  return {
    slug: trimString(presskit.slug as string) || "",
    artistName: trimString(presskit.artistName as string) || "",
    about: normalizeAbout(presskit),
    gallery: normalizeGallery(presskit),
    events: normalizeEvents(presskit),
    releases: normalizeReleases(presskit),
    youtube: normalizeYoutube(presskit),
    rider: normalizeRider(presskit),
    socials: normalizeSocials(presskit),
    contact: normalizeContact(presskit),
  };
}
