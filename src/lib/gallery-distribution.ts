/**
 * Gallery image type (matches API response)
 */
export interface GalleryImage {
  id: string;
  url: string;
  sortOrder?: number;
}

/**
 * Gallery distribution result
 */
export interface GalleryDistribution {
  /** Images for the carousel component */
  carouselImages: GalleryImage[];
  /** Images for the parallax gallery component */
  parallaxImages: GalleryImage[];
  /** Whether to render the carousel */
  showCarousel: boolean;
  /** Whether to render the parallax gallery */
  showParallax: boolean;
}

/**
 * Calculate intelligent gallery distribution
 *
 * Decides how to split images between carousel and parallax gallery
 * based on total image count. This is a pure function usable in both
 * server and client components.
 *
 * Distribution rules (max 20 images):
 * - 5 images: carousel only (5)
 * - 6-9 images: carousel (5) + parallax (rest, 1 page)
 * - 10-14 images: carousel (5) + parallax (rest)
 * - 15+ images: carousel (10) + parallax (10) = 20 max
 *
 * @param allImages - All gallery images from presskit
 * @returns Distribution with images and visibility flags
 */
export function calculateGalleryDistribution(
  allImages: GalleryImage[] | undefined,
): GalleryDistribution {
  // Handle empty/undefined
  if (!allImages || allImages.length === 0) {
    return {
      carouselImages: [],
      parallaxImages: [],
      showCarousel: false,
      showParallax: false,
    };
  }

  // Max 20 images total
  const images = allImages.slice(0, 20);
  const total = images.length;

  // Need minimum 5 for a proper carousel
  if (total < 5) {
    return {
      carouselImages: images,
      parallaxImages: [],
      showCarousel: images.length > 0,
      showParallax: false,
    };
  }

  // 15+ images: split 10 + 10
  if (total >= 15) {
    return {
      carouselImages: images.slice(0, 10),
      parallaxImages: images.slice(10, 20),
      showCarousel: true,
      showParallax: true,
    };
  }

  // 5-14 images: carousel takes first 5, parallax takes rest
  const carouselImages = images.slice(0, 5);
  const parallaxImages = images.slice(5);

  return {
    carouselImages,
    parallaxImages,
    // Always show carousel if we have 5+ images
    showCarousel: true,
    // Show parallax if we have at least 4 extra images (for decent layout)
    showParallax: parallaxImages.length >= 4,
  };
}
