"use client";

/**
 * YouTubeCarousel Component
 *
 * Swiper carousel for displaying YouTube videos.
 * Features:
 * - External navigation (controlled by parent via ref)
 * - Responsive breakpoints
 * - Integrated player modal
 */

import React, { useCallback, useRef, useImperativeHandle, forwardRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Keyboard, A11y } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";

import { YouTubeCard } from "./YouTubeCard";
import { YouTubePlayer } from "./YouTubePlayer";
import { cn } from "@/lib/cn";

// =============================================================================
// Types
// =============================================================================

export interface YouTubeCarouselRef {
  slidePrev: () => void;
  slideNext: () => void;
}

export interface YouTubeVideo {
  id: string;
  videoId: string;
  title?: string;
}

interface YouTubeCarouselProps {
  videos: YouTubeVideo[];
  className?: string;
}

// =============================================================================
// Component
// =============================================================================

export const YouTubeCarousel = forwardRef<YouTubeCarouselRef, YouTubeCarouselProps>(
  ({ videos, className }, ref) => {
    const swiperRef = useRef<SwiperType | null>(null);
    const [activeVideoId, setActiveVideoId] = useState<string | null>(null);

    // Expose navigation methods to parent
    useImperativeHandle(ref, () => ({
      slidePrev: () => swiperRef.current?.slidePrev(),
      slideNext: () => swiperRef.current?.slideNext(),
    }));

    const handleSwiper = useCallback((swiper: SwiperType) => {
      swiperRef.current = swiper;
    }, []);

    const handlePlay = useCallback((videoId: string) => {
      setActiveVideoId(videoId);
    }, []);

    const handleClosePlayer = useCallback(() => {
      setActiveVideoId(null);
    }, []);

    if (videos.length === 0) {
      return null;
    }

    return (
      <>
        <div className={cn("w-full", className)}>
          <Swiper
            modules={[Keyboard, A11y]}
            onSwiper={handleSwiper}
            keyboard={{ enabled: true }}
            loop={videos.length > 2}
            a11y={{
              enabled: true,
              prevSlideMessage: "Previous video",
              nextSlideMessage: "Next video",
            }}
            breakpoints={{
              // Mobile: 1 slide
              0: {
                slidesPerView: 1,
                spaceBetween: 16,
              },
              // Tablet: 1.5 slides (peek)
              768: {
                slidesPerView: 1.2,
                spaceBetween: 20,
              },
              // Desktop: 1.3 slides
              1024: {
                slidesPerView: 1.1,
                spaceBetween: 24,
              },
              // Large desktop
              1440: {
                slidesPerView: 1.3,
                spaceBetween: 24,
              },
            }}
            className="overflow-visible!"
          >
            {videos.map((video) => (
              <SwiperSlide key={video.id}>
                <YouTubeCard
                  videoId={video.videoId}
                  title={video.title}
                  onPlay={() => handlePlay(video.videoId)}
                  className="h-full"
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Player Modal */}
        <YouTubePlayer
          videoId={activeVideoId || ""}
          isOpen={!!activeVideoId}
          onClose={handleClosePlayer}
        />
      </>
    );
  },
);

YouTubeCarousel.displayName = "YouTubeCarousel";

export default YouTubeCarousel;
