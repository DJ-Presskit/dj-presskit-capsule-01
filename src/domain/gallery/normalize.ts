/**
 * Gallery Section Normalizer
 */

import type { GalleryVM, GalleryImageVM } from "../types";
import { safeUrl, generateStableKey, dedupeById } from "../validators";

interface GalleryImageDTO {
  id?: string;
  url?: string;
  alt?: string;
  width?: number;
  height?: number;
  sortOrder?: number;
}

interface GalleryDTO {
  media?: {
    gallery?: GalleryImageDTO[];
  };
}

const MAX_GALLERY_IMAGES = 20;

export function normalizeGallery(dto: GalleryDTO | null | undefined): GalleryVM {
  const galleryItems = dto?.media?.gallery;

  if (!Array.isArray(galleryItems) || galleryItems.length === 0) {
    return {
      images: [],
      hasImages: false,
      totalCount: 0,
    };
  }

  // Normalize and filter valid images
  const images: GalleryImageVM[] = [];

  for (let i = 0; i < galleryItems.length && images.length < MAX_GALLERY_IMAGES; i++) {
    const item = galleryItems[i];
    const url = safeUrl(item?.url);

    if (!url) continue;

    images.push({
      id: item?.id || generateStableKey(item, i),
      url,
      alt: typeof item?.alt === "string" ? item.alt.trim() : "Gallery image",
      width: typeof item?.width === "number" ? item.width : null,
      height: typeof item?.height === "number" ? item.height : null,
    });
  }

  // Remove duplicates
  const uniqueImages = dedupeById(images);

  return {
    images: uniqueImages,
    hasImages: uniqueImages.length > 0,
    totalCount: uniqueImages.length,
  };
}
