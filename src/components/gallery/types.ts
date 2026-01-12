/**
 * Gallery Carousel Types
 *
 * Used by GalleryCarousel component for center-focus carousel effect.
 */

/**
 * Single gallery image with CDN-optimized data
 */
export interface GalleryImage {
  id: string;
  url: string;
  alt?: string;
  width?: number;
  height?: number;
}

/**
 * GalleryCarousel component props
 */
export interface GalleryCarouselProps {
  /** Array of gallery images (max 20 supported, 10 shown per mode) */
  images: GalleryImage[];

  /**
   * Selection mode:
   * - "first10" (default): Show first 10 images
   * - "last10": Show last 10 images (useful for "remaining" gallery section)
   */
  mode?: "first10" | "last10";

  /** Additional CSS classes for the container */
  className?: string;

  /** Initial slide index to show */
  initialIndex?: number;
}
