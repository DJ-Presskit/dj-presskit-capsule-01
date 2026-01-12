"use client";

/**
 * GalleryCarousel
 *
 * Premium center-focus carousel with rotation/depth effect on lateral slides.
 * Features:
 * - Center slide is protagonist (full scale, no rotation)
 * - Side slides rotate with depth effect (3D perspective)
 * - Gradual blur on carousel edges
 * - Custom navigation buttons
 *
 * Uses watchSlidesProgress + onProgress for smooth 60fps transforms.
 */

import React, { useCallback, useMemo, useRef, useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Keyboard, A11y } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { OptimizedImage } from "@/components/media";
import GradualBlur from "@/components/ui/GradualBlur";
import { cn } from "@/lib/cn";

import type { GalleryCarouselProps } from "./types";

// CSS imports are in globals.css

// =============================================================================
// CONSTANTS
// =============================================================================

const MAX_IMAGES = 10;

/**
 * Transform configuration for the center-focus effect.
 * These values create the "premium depth" look from the design reference.
 */
const TRANSFORM_CONFIG = {
  // Maximum rotation in degrees (slides rotate based on distance from center)
  maxRotation: -10,
  // Scale reduction per unit of progress (center = 1, edges smaller)
  scaleReduction: 0.12,
  // Minimum scale (prevent slides from becoming too small)
  minScale: 0.7,
  // Horizontal translation per unit of progress
  translateXFactor: 20,
  // Vertical translation for arc/semicircle effect (side slides move down)
  translateYFactor: 40,
  // Target opacity for side slides (50% as per design reference)
  sideOpacity: 0.5,
} as const;

// =============================================================================
// COMPONENT
// =============================================================================

export const GalleryCarousel: React.FC<GalleryCarouselProps> = ({
  images,
  mode = "first10",
  className,
  initialIndex = 0,
}) => {
  const swiperRef = useRef<SwiperType | null>(null);
  const [isReady, setIsReady] = useState(false);

  // ---------------------------------------------------------------------------
  // Image Selection Logic
  // ---------------------------------------------------------------------------

  const selectedImages = useMemo(() => {
    if (!images || images.length === 0) return [];

    // If 10 or fewer, show all
    if (images.length <= MAX_IMAGES) return images;

    // Otherwise, slice based on mode
    if (mode === "last10") {
      return images.slice(-MAX_IMAGES);
    }

    return images.slice(0, MAX_IMAGES);
  }, [images, mode]);

  // ---------------------------------------------------------------------------
  // Transform Effect Handler
  // ---------------------------------------------------------------------------

  /**
   * Applies dynamic transforms to slides based on their progress (distance from center).
   * Called on every slide update for smooth animations.
   * - Center slide: full opacity, no rotation
   * - Side slides: 60% opacity, rotated with 3D depth effect
   */
  const applyTransforms = useCallback((swiper: SwiperType) => {
    const slides = swiper.slides;

    slides.forEach((slideEl) => {
      // Get slide progress: 0 = center, negative = left, positive = right
      const slideProgress = (slideEl as HTMLElement & { progress?: number }).progress ?? 0;
      const absProgress = Math.abs(slideProgress);

      // Calculate rotation (negative for left slides, positive for right slides)
      // Clamp to maxRotation to prevent extreme angles
      const rotate = slideProgress * TRANSFORM_CONFIG.maxRotation;

      // Calculate scale reduction based on distance from center
      const scale = Math.max(
        TRANSFORM_CONFIG.minScale,
        1 - absProgress * TRANSFORM_CONFIG.scaleReduction,
      );

      // Horizontal translation for depth effect
      const translateX = slideProgress * TRANSFORM_CONFIG.translateXFactor;

      // Vertical translation: side slides move DOWN to create arc/semicircle effect
      // Center slide (absProgress = 0) stays at top, side slides move down
      const translateY = absProgress * TRANSFORM_CONFIG.translateYFactor;

      // Opacity: center = 1, side slides = sideOpacity
      // Interpolate smoothly between 1 and sideOpacity based on progress
      const opacity =
        absProgress > 0.1
          ? TRANSFORM_CONFIG.sideOpacity
          : 1 - absProgress * (1 - TRANSFORM_CONFIG.sideOpacity) * 10;

      // Apply transforms directly for performance (avoid React re-renders)
      const slideInner = slideEl as HTMLElement;
      slideInner.style.transform = `rotate(${rotate}deg) scale(${scale}) translateX(${translateX}px) translateY(${translateY}px)`;
      slideInner.style.opacity = opacity.toString();
      slideInner.style.transition =
        "transform 0.4s cubic-bezier(0.25, 0.1, 0.25, 1), opacity 0.4s ease-out";
    });
  }, []);

  // ---------------------------------------------------------------------------
  // Navigation Handlers
  // ---------------------------------------------------------------------------

  const handlePrev = useCallback(() => {
    swiperRef.current?.slidePrev();
  }, []);

  const handleNext = useCallback(() => {
    swiperRef.current?.slideNext();
  }, []);

  // ---------------------------------------------------------------------------
  // Swiper Event Handlers
  // ---------------------------------------------------------------------------

  const handleSwiper = useCallback(
    (swiper: SwiperType) => {
      swiperRef.current = swiper;
      setIsReady(true);
      // Initial transform application
      applyTransforms(swiper);
    },
    [applyTransforms],
  );

  const handleProgress = useCallback(
    (swiper: SwiperType) => {
      applyTransforms(swiper);
    },
    [applyTransforms],
  );

  const handleSlideChange = useCallback(
    (swiper: SwiperType) => {
      applyTransforms(swiper);
    },
    [applyTransforms],
  );

  // ---------------------------------------------------------------------------
  // Early Return for Empty State
  // ---------------------------------------------------------------------------

  if (selectedImages.length === 0) {
    return null;
  }

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <div className={cn("relative w-full overflow-hidden section-py", className)}>
      {/* Lateral Blur Overlays */}
      <GradualBlur
        position="left"
        strength={1}
        width="50px"
        target="parent"
        zIndex={20}
        className="pointer-events-none"
      />
      <GradualBlur
        position="right"
        strength={1}
        width="50px"
        target="parent"
        zIndex={20}
        className="pointer-events-none"
      />

      {/* Swiper Carousel */}
      <Swiper
        modules={[Keyboard, A11y]}
        onSwiper={handleSwiper}
        onProgress={handleProgress}
        onSlideChange={handleSlideChange}
        loop={selectedImages.length > 2}
        centeredSlides
        initialSlide={initialIndex}
        watchSlidesProgress
        keyboard={{ enabled: true }}
        a11y={{
          enabled: true,
          prevSlideMessage: "Previous image",
          nextSlideMessage: "Next image",
        }}
        breakpoints={{
          // Mobile: 1 slide visible, centered
          0: { slidesPerView: 1, spaceBetween: 20 },
          // Tablet: still 1 slide visible
          768: { slidesPerView: 1, spaceBetween: 30 },
          // Desktop: 3 slides visible with center focus
          1024: { slidesPerView: 3, spaceBetween: 40 },
        }}
        className=""
      >
        {selectedImages.map((image, index) => (
          <SwiperSlide
            key={image.id}
            style={{
              willChange: "transform, opacity",
              transformStyle: "preserve-3d",
            }}
          >
            <div className="w-[80%] mx-auto aspect-3/4 rounded-xl overflow-hidden">
              <OptimizedImage
                src={image.url}
                alt={image.alt || `Gallery image ${index + 1}`}
                fill
                sizesPreset="gallery"
                loadingStrategy={index === 0 ? "eager" : "lazy"}
                className="object-cover"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Navigation Buttons */}
      {isReady && selectedImages.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            aria-label="Previous image"
            className={cn(
              "absolute left-4 md:left-[30%] top-1/2 -translate-y-1/2 z-30 cursor-pointer",
              "w-11 h-11 md:w-14 md:h-14 rounded-full",
              "bg-white/90 backdrop-blur-sm shadow-lg",
              "flex items-center justify-center",
              "text-background hover:bg-white",
              "transition-all duration-200 hover:scale-105",
              "focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2",
            )}
          >
            <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
          </button>
          <button
            onClick={handleNext}
            aria-label="Next image"
            className={cn(
              "absolute right-4 md:right-[30%] top-1/2 -translate-y-1/2 z-30 cursor-pointer",
              "w-11 h-11 md:w-14 md:h-14 rounded-full",
              "bg-white/90 backdrop-blur-sm shadow-lg",
              "flex items-center justify-center",
              "text-background hover:bg-white",
              "transition-all duration-200 hover:scale-105",
              "focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2",
            )}
          >
            <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
          </button>
        </>
      )}
    </div>
  );
};

export default GalleryCarousel;
