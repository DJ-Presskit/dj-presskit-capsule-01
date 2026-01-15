"use client";

/**
 * YouTube Section
 *
 * Displays YouTube videos in a carousel layout matching the design:
 * - LEFT: Large video carousel with thumbnails
 * - RIGHT: Dynamic video title + navigation arrows
 */

import { useRef, useMemo, useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Keyboard, A11y } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import Image from "next/image";
import { Play } from "lucide-react";
import { usePresskit } from "@/context";
import { useI18n } from "@/core/i18n";
import { cn } from "@/lib/cn";
import { GradualBlur } from "@/components/ui";
import { YouTubePlayer } from "@/components/youtube";
import { extractYoutubeId, getYoutubeThumbnailUrl } from "@/domain/validators";
import { BackgroundRenderer } from "@/core/background";

// =============================================================================
// Types
// =============================================================================

interface YouTubeVideoData {
  id: string;
  videoId: string;
  title: string;
}

// =============================================================================
// Helpers
// =============================================================================

/**
 * Fetch video title from YouTube oEmbed API
 */
async function fetchVideoTitle(videoId: string): Promise<string> {
  try {
    const url = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;
    const response = await fetch(url);
    if (!response.ok) return "Video";
    const data = await response.json();
    return data.title || "Video";
  } catch {
    return "Video";
  }
}

// =============================================================================
// Subcomponents
// =============================================================================

interface YouTubeNavigationProps {
  onPrev: () => void;
  onNext: () => void;
  className?: string;
}

function YouTubeNavigation({ onPrev, onNext, className }: YouTubeNavigationProps) {
  const { t } = useI18n();

  const buttonClass = "p-2 cursor-pointer text-accent hover:text-accent/80 transition";
  const iconClass = "w-6 h-6 lg:w-8 lg:h-8";

  return (
    <nav className={cn("flex items-center gap-2", className)} aria-label="Carousel navigation">
      <button onClick={onPrev} aria-label={t("common.previous")} className={buttonClass}>
        <ChevronLeft className={iconClass} />
      </button>
      <button onClick={onNext} aria-label={t("common.next")} className={buttonClass}>
        <ChevronRight className={iconClass} />
      </button>
    </nav>
  );
}

/**
 * Animated Video Title - Letter-by-letter staggered animation
 * Same animation style as Text component's title variant
 */
interface AnimatedVideoTitleProps {
  title: string;
  videoId: string;
  className?: string;
}

function AnimatedVideoTitle({ title, videoId, className }: AnimatedVideoTitleProps) {
  let letterIndex = 0;

  const words = title.split(" ");

  return (
    <h3
      key={videoId}
      className={cn(
        "text-2xl md:text-3xl lg:text-4xl xl:text-5xl text-foreground uppercase font-extrabold",
        className,
      )}
    >
      {words.map((word, wIdx) => (
        <span
          key={`word-${wIdx}`}
          className="inline-block whitespace-pre"
          style={{ fontFamily: "var(--font-primary)", fontWeight: 900 }}
        >
          {word.split("").map((letter, lIdx) => {
            const delay = letterIndex * 0.02;
            letterIndex++;

            return (
              <motion.span
                key={`${videoId}-letter-${wIdx}-${lIdx}`}
                initial={{ opacity: 0, x: "-100%", filter: "blur(5px)" }}
                animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                transition={{
                  delay,
                  duration: 0.3,
                  ease: [0.1, 0.71, 0.88, 1],
                }}
                style={{
                  display: "inline-block",
                  transformOrigin: "bottom center",
                  fontFamily: "var(--font-primary)",
                }}
              >
                {letter}
              </motion.span>
            );
          })}
          {wIdx < words.length - 1 && <span className="inline-block w-[0.25em]">&nbsp;</span>}
        </span>
      ))}
    </h3>
  );
}

interface VideoThumbnailProps {
  videoId: string;
  onClick: () => void;
}

function VideoThumbnail({ videoId, onClick }: VideoThumbnailProps) {
  // Use hqdefault which is guaranteed to exist for all YouTube videos
  // maxresdefault only exists for HD videos and fallback via onError is unreliable
  const thumbnailUrl = getYoutubeThumbnailUrl(videoId, "hq");

  return (
    <div
      className={cn(
        "group relative cursor-pointer rounded-xl overflow-hidden bg-background-lighter",
        "transition",
      )}
      onClick={onClick}
    >
      {/* Thumbnail Container */}
      <div className="relative aspect-video w-full overflow-hidden">
        <Image
          src={thumbnailUrl}
          alt="YouTube video"
          fill
          sizes="(max-width: 768px) 100vw, 60vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* Play Button Overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className={cn(
              "rounded-full bg-accent p-4 w-15 h-15 flex items-center justify-center hover:opacity-80 transition duration-300",
            )}
          >
            <Play className="fill-background-lighter text-background-lighter group-hover:scale-120 transition duration-300" />
          </div>
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// Component
// =============================================================================

export function YouTube() {
  const { presskit } = usePresskit();
  const swiperRef = useRef<SwiperType | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);
  const [videoTitles, setVideoTitles] = useState<Record<string, string>>({});

  // Transform API data to video view models
  const videos = useMemo<YouTubeVideoData[]>(() => {
    const videoUrls = presskit.youtube?.videos ?? [];
    return videoUrls
      .map((url, index) => {
        const videoId = extractYoutubeId(url);
        if (!videoId) return null;
        return {
          id: `yt-${index}-${videoId}`,
          videoId,
          title: videoTitles[videoId] || "Video",
        };
      })
      .filter((v): v is YouTubeVideoData => v !== null);
  }, [presskit.youtube?.videos, videoTitles]);

  // Fetch titles for all videos
  useEffect(() => {
    const videoUrls = presskit.youtube?.videos ?? [];
    videoUrls.forEach((url) => {
      const videoId = extractYoutubeId(url);
      if (videoId && !videoTitles[videoId]) {
        fetchVideoTitle(videoId).then((title) => {
          setVideoTitles((prev) => ({ ...prev, [videoId]: title }));
        });
      }
    });
  }, [presskit.youtube?.videos, videoTitles]);

  const hasVideos = videos.length > 0;
  const currentVideo = videos[activeIndex];

  // Navigation handlers
  const handlePrev = useCallback(() => swiperRef.current?.slidePrev(), []);
  const handleNext = useCallback(() => swiperRef.current?.slideNext(), []);
  const handleSlideChange = useCallback((swiper: SwiperType) => {
    setActiveIndex(swiper.realIndex);
  }, []);

  const handlePlay = useCallback((videoId: string) => {
    setActiveVideoId(videoId);
  }, []);

  const handleClosePlayer = useCallback(() => {
    setActiveVideoId(null);
  }, []);

  // Don't render if no videos
  if (!hasVideos) {
    return null;
  }

  return (
    <>
      <section
        id="youtube"
        className="max-w-[1500px] relative min-[2500px]:max-w-[1800px] mx-auto section-py overflow-x-hidden"
      >
        {/* Layout Container - Video LEFT, Title RIGHT */}
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-5 items-center lg:section-px">
          {/* Left Column: Video Carousel - takes 60% on desktop */}
          <div className="relative overflow-hidden order-1 lg:max-w-[800px] xl:max-w-[900px] py-10">
            <GradualBlur
              position="left"
              strength={0.5}
              width="30px"
              target="parent"
              zIndex={10}
              className="pointer-events-none"
            />
            <Swiper
              modules={[Keyboard, A11y]}
              onSwiper={(swiper) => {
                swiperRef.current = swiper;
              }}
              onSlideChange={handleSlideChange}
              keyboard={{ enabled: true }}
              loop={videos.length > 1}
              a11y={{
                enabled: true,
                prevSlideMessage: "Previous video",
                nextSlideMessage: "Next video",
              }}
              slidesPerView={1}
              breakpoints={{
                0: {
                  spaceBetween: 20,
                },
                768: {
                  spaceBetween: 50,
                },
                1024: {
                  spaceBetween: 50,
                },
                1280: {
                  spaceBetween: 80,
                },
                1536: {
                  spaceBetween: 80,
                },
              }}
            >
              {videos.map((video) => (
                <SwiperSlide key={video.id} className="p-5">
                  <VideoThumbnail
                    videoId={video.videoId}
                    onClick={() => handlePlay(video.videoId)}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
            <GradualBlur
              position="right"
              strength={0.5}
              width="30px"
              target="parent"
              zIndex={10}
              className="pointer-events-none"
            />
          </div>

          {/* Right Column: Title + Navigation */}
          <div className="flex flex-col items-center lg:items-end gap-5 order-2 lg:justify-between lg:min-h-[180px]">
            {/* Video Title - Animated letter-by-letter on slide change */}
            <div className="min-h-[80px] lg:min-h-[120px] flex items-start">
              <AnimatedVideoTitle
                key={currentVideo?.videoId || "default"}
                title={currentVideo?.title || "Video"}
                videoId={currentVideo?.videoId || "default"}
                className="text-center lg:text-right section-px lg:px-0"
              />
            </div>

            {/* Navigation - Fixed position */}
            {videos.length > 1 && <YouTubeNavigation onPrev={handlePrev} onNext={handleNext} />}
          </div>
        </div>
      </section>

      {/* Player Modal */}
      <YouTubePlayer
        videoId={activeVideoId || ""}
        isOpen={!!activeVideoId}
        onClose={handleClosePlayer}
      />
    </>
  );
}

export default YouTube;
