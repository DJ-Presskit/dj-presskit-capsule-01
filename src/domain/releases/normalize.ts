/**
 * Releases Section Normalizer
 */

import type { ReleasesVM, ReleaseVM } from "../types";
import { trimString, safeUrl, parseDate, formatDate, sortByDate, dedupeById } from "../validators";

interface ReleaseDTO {
  id?: string;
  title?: string;
  releaseDate?: string | null;
  label?: string;
  url?: string;
}

interface ReleasesDTO {
  releases?: {
    upcoming?: ReleaseDTO[];
  };
}

function normalizeRelease(dto: ReleaseDTO, index: number): ReleaseVM | null {
  const title = trimString(dto.title);
  if (!title) return null; // Title is required

  const releaseDate = parseDate(dto.releaseDate);

  return {
    id: dto.id || `release-${index}`,
    title,
    releaseDate,
    releaseDateFormatted: formatDate(releaseDate),
    label: trimString(dto.label),
    url: safeUrl(dto.url),
  };
}

export function normalizeReleases(dto: ReleasesDTO | null | undefined): ReleasesVM {
  const releasesData = dto?.releases;
  const upcomingRaw = Array.isArray(releasesData?.upcoming) ? releasesData.upcoming : [];

  const items = upcomingRaw
    .map((r, i) => normalizeRelease(r, i))
    .filter((r): r is ReleaseVM => r !== null);

  // Dedupe and sort by release date (newest first)
  const uniqueItems = dedupeById(items);
  const sortedItems = sortByDate(uniqueItems, (r) => r.releaseDate, "desc");

  return {
    items: sortedItems,
    hasReleases: sortedItems.length > 0,
  };
}
