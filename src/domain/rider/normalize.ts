/**
 * Technical Rider Section Normalizer
 */

import type { RiderVM, RiderItemVM } from "../types";
import { trimString, safeUrl, dedupeById } from "../validators";

interface RiderItemDTO {
  id?: string;
  name?: string;
  title?: string;
  imageUrl?: string;
  customTitle?: string;
  note?: string;
  sortOrder?: number;
}

interface RiderDTO {
  technicalRider?: {
    items?: RiderItemDTO[];
  };
  driveUrl?: string;
}

function normalizeRiderItem(dto: RiderItemDTO, index: number): RiderItemVM | null {
  const name = trimString(dto.name);
  const title = trimString(dto.title);

  // At minimum need a name or title
  if (!name && !title) return null;

  return {
    id: dto.id || `rider-${index}`,
    name: name || "",
    title: title || "",
    imageUrl: safeUrl(dto.imageUrl),
    customTitle: trimString(dto.customTitle),
    note: trimString(dto.note),
    sortOrder: typeof dto.sortOrder === "number" ? dto.sortOrder : index,
  };
}

export function normalizeRider(dto: RiderDTO | null | undefined): RiderVM {
  const riderData = dto?.technicalRider;
  const itemsRaw = Array.isArray(riderData?.items) ? riderData.items : [];

  const items = itemsRaw
    .map((item, i) => normalizeRiderItem(item, i))
    .filter((item): item is RiderItemVM => item !== null);

  // Dedupe and sort by sortOrder
  const uniqueItems = dedupeById(items);
  const sortedItems = [...uniqueItems].sort((a, b) => a.sortOrder - b.sortOrder);

  // Get download URL (Drive URL from presskit)
  const downloadUrl = safeUrl(dto?.driveUrl);

  return {
    items: sortedItems,
    downloadUrl,
    hasItems: sortedItems.length > 0,
  };
}
