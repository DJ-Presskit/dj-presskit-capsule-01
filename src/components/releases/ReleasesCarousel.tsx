"use client";

/**
 * ReleasesCarousel Component
 *
 * Swiper carousel for displaying releases.
 * Features:
 * - External navigation (controlled by parent via ref)
 * - Responsive breakpoints
 * - Simple flat cards (no 3D effects)
 */

import React, { useCallback, useRef, useImperativeHandle, forwardRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Keyboard, A11y, Grid } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";

import { ReleaseCard } from "./ReleaseCard";
import type { ReleaseView } from "@/types";
import { cn } from "@/lib/cn";

// Import Swiper Grid styles
import "swiper/css/grid";

// =============================================================================
// Types
// =============================================================================

export interface ReleasesCarouselRef {
  slidePrev: () => void;
  slideNext: () => void;
}

interface ReleasesCarouselProps {
  releases: ReleaseView[];
  className?: string;
}

// =============================================================================
// Component
// =============================================================================

export const ReleasesCarousel = forwardRef<ReleasesCarouselRef, ReleasesCarouselProps>(
  ({ releases, className }, ref) => {
    const swiperRef = useRef<SwiperType | null>(null);

    // Expose navigation methods to parent
    useImperativeHandle(ref, () => ({
      slidePrev: () => swiperRef.current?.slidePrev(),
      slideNext: () => swiperRef.current?.slideNext(),
    }));

    const handleSwiper = useCallback((swiper: SwiperType) => {
      swiperRef.current = swiper;
    }, []);

    if (releases.length === 0) {
      return null;
    }

    return (
      <div className={cn("w-full", className)}>
        <Swiper
          modules={[Keyboard, A11y, Grid]}
          onSwiper={handleSwiper}
          keyboard={{ enabled: true }}
          loop={releases.length > 4}
          a11y={{
            enabled: true,
            prevSlideMessage: "Previous release",
            nextSlideMessage: "Next release",
          }}
          breakpoints={{
            // Mobile: 1 column, 2 rows (one above other)
            0: {
              slidesPerView: 1,
              spaceBetween: 25,
              grid: {
                fill: "row",
                rows: 2,
              },
            },
            // Tablet: 2 slides
            768: {
              slidesPerView: 1.5,
              spaceBetween: 25,
              grid: { rows: 1 },
            },
            // Desktop: 2.5 slides (peek next)
            1024: {
              slidesPerView: 1.3,
              spaceBetween: 25,
              grid: { rows: 1 },
            },
            // Large desktop: 3 slides
            1440: {
              slidesPerView: 2.2,
              spaceBetween: 25,
              grid: { rows: 1 },
            },
          }}
          className="overflow-visible!"
        >
          {releases.map((release) => (
            <SwiperSlide key={release.id} className="">
              <ReleaseCard release={release} className="h-full" />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    );
  },
);

ReleasesCarousel.displayName = "ReleasesCarousel";

export default ReleasesCarousel;
