"use client";

/**
 * Gallery Section
 *
 * Scroll-animated scattered layout with two 5-image pages.
 * Images start clustered and spread to randomized positions on scroll.
 * Features: blur animation, border-radius animation, staggered reveals.
 */

import { useMemo, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { usePresskit } from "@/context";
import { OptimizedImage } from "@/components/media";
import { cn } from "@/lib/cn";

// =============================================================================
// Position Configurations
// =============================================================================

/**
 * Scattered positions for 5 images per "page"
 * More randomized layout with varied positions and sizes
 */
interface ImagePosition {
  x: string;
  y: string;
  startX: string;
  startY: string;
  width: string;
  height: string;
  zIndex: number;
  mobileX: string;
  mobileY: string;
  mobileWidth: string;
  mobileHeight: string;
}

// Page 1: Randomized scattered positions, ~10% smaller sizes
const POSITIONS_PAGE_1: ImagePosition[] = [
  // Top-left corner area
  {
    x: "0%",
    y: "3%",
    startX: "42%",
    startY: "42%",
    width: "clamp(180px, 28vw, 420px)",
    height: "clamp(230px, 36vw, 520px)",
    zIndex: 5,
    mobileX: "0%",
    mobileY: "2%",
    mobileWidth: "44%",
    mobileHeight: "180px",
  },
  // Top-right area (offset from corner)
  {
    x: "calc(100% - clamp(190px, 30vw, 440px))",
    y: "8%",
    startX: "44%",
    startY: "40%",
    width: "clamp(190px, 30vw, 440px)",
    height: "clamp(240px, 38vw, 540px)",
    zIndex: 4,
    mobileX: "48%",
    mobileY: "18%",
    mobileWidth: "50%",
    mobileHeight: "160px",
  },
  // Center-left (not centered)
  {
    x: "40%",
    y: "35%",
    startX: "40%",
    startY: "40%",
    width: "clamp(185px, 29vw, 430px)",
    height: "clamp(235px, 37vw, 530px)",
    zIndex: 6,
    mobileX: "8%",
    mobileY: "38%",
    mobileWidth: "52%",
    mobileHeight: "200px",
  },
  // Bottom-left (pushed up)
  {
    x: "5%",
    y: "calc(100% - clamp(210px, 32vw, 460px))",
    startX: "46%",
    startY: "44%",
    width: "clamp(175px, 26vw, 380px)",
    height: "clamp(210px, 32vw, 460px)",
    zIndex: 3,
    mobileX: "2%",
    mobileY: "62%",
    mobileWidth: "42%",
    mobileHeight: "170px",
  },
  // Bottom-right area
  {
    x: "calc(100% - clamp(185px, 28vw, 410px))",
    y: "calc(100% - clamp(220px, 34vw, 250px))",
    startX: "42%",
    startY: "46%",
    width: "clamp(185px, 28vw, 410px)",
    height: "clamp(220px, 34vw, 480px)",
    zIndex: 4,
    mobileX: "50%",
    mobileY: "58%",
    mobileWidth: "48%",
    mobileHeight: "190px",
  },
];

// Page 2: Different randomized pattern
const POSITIONS_PAGE_2: ImagePosition[] = [
  // Top-left (offset)
  {
    x: "0%",
    y: "5%",
    startX: "44%",
    startY: "44%",
    width: "clamp(185px, 29vw, 430px)",
    height: "clamp(235px, 37vw, 530px)",
    zIndex: 5,
    mobileX: "5%",
    mobileY: "5%",
    mobileWidth: "46%",
    mobileHeight: "175px",
  },
  // Top-right corner
  {
    x: "calc(100% - clamp(175px, 27vw, 400px))",
    y: "2%",
    startX: "42%",
    startY: "42%",
    width: "clamp(175px, 27vw, 400px)",
    height: "clamp(225px, 35vw, 500px)",
    zIndex: 4,
    mobileX: "52%",
    mobileY: "0%",
    mobileWidth: "45%",
    mobileHeight: "165px",
  },
  // Center-right area
  {
    x: "35%",
    y: "30%",
    startX: "42%",
    startY: "42%",
    width: "clamp(195px, 31vw, 460px)",
    height: "clamp(250px, 40vw, 580px)",
    zIndex: 6,
    mobileX: "35%",
    mobileY: "32%",
    mobileWidth: "55%",
    mobileHeight: "210px",
  },
  // Bottom-left corner
  {
    x: "0%",
    y: "calc(100% - clamp(235px, 36vw, 200px))",
    startX: "40%",
    startY: "46%",
    width: "clamp(190px, 30vw, 440px)",
    height: "clamp(235px, 36vw, 500px)",
    zIndex: 4,
    mobileX: "0%",
    mobileY: "55%",
    mobileWidth: "48%",
    mobileHeight: "180px",
  },
  // Bottom-right (offset up)
  {
    x: "calc(100% - clamp(180px, 26vw, 390px))",
    y: "calc(100% - clamp(215px, 32vw, 250px))",
    startX: "44%",
    startY: "44%",
    width: "clamp(180px, 26vw, 390px)",
    height: "clamp(215px, 32vw, 450px)",
    zIndex: 3,
    mobileX: "55%",
    mobileY: "60%",
    mobileWidth: "44%",
    mobileHeight: "175px",
  },
];

// =============================================================================
// Animated Image Component
// =============================================================================

interface AnimatedGalleryImageProps {
  image: { url: string; id?: string };
  position: ImagePosition;
  index: number;
  artistName: string;
  scrollProgress: ReturnType<typeof useTransform<number, number>>;
}

function AnimatedGalleryImage({
  image,
  position,
  index,
  artistName,
  scrollProgress,
}: AnimatedGalleryImageProps) {
  const staggerOffset = index * 0.06;
  const start = staggerOffset;
  const mid = 0.3 + staggerOffset;
  const end = 0.6 + staggerOffset;

  const x = useTransform(scrollProgress, [start, end], [position.startX, position.x]);
  const y = useTransform(scrollProgress, [start, end], [position.startY, position.y]);
  const opacity = useTransform(scrollProgress, [start, start + 0.08], [0.2, 1]);
  const scale = useTransform(scrollProgress, [start, end], [0.75, 1]);
  const borderRadius = useTransform(scrollProgress, [start, end], [0, 12]);
  const blur = useTransform(scrollProgress, [start, mid], [23, 0]);

  return (
    <motion.div
      className={cn(
        "absolute overflow-hidden shadow-2xl",
        "transition-shadow duration-300 hover:shadow-3xl",
        "max-lg:!left-[var(--mobile-x)] max-lg:!top-[var(--mobile-y)]",
        "max-lg:!w-[var(--mobile-w)] max-lg:!h-[var(--mobile-h)]",
      )}
      style={{
        left: x,
        top: y,
        width: position.width,
        height: position.height,
        zIndex: position.zIndex,
        opacity,
        scale,
        borderRadius,
        filter: useTransform(blur, (v) => `blur(${v}px)`),
        // @ts-expect-error - CSS custom properties
        "--mobile-x": position.mobileX,
        "--mobile-y": position.mobileY,
        "--mobile-w": position.mobileWidth,
        "--mobile-h": position.mobileHeight,
      }}
    >
      <OptimizedImage
        src={image.url}
        alt={`${artistName} gallery ${index + 1}`}
        fill
        sizesPreset="gallery"
        loadingStrategy={index < 3 ? "eager" : "lazy"}
        className="object-cover"
      />
    </motion.div>
  );
}

// =============================================================================
// Gallery Page Component (5 images)
// =============================================================================

interface GalleryPageProps {
  images: Array<{ url: string; id?: string }>;
  positions: ImagePosition[];
  artistName: string;
  scrollProgress: ReturnType<typeof useTransform<number, number>>;
  pageIndex: number;
}

function GalleryPage({
  images,
  positions,
  artistName,
  scrollProgress,
  pageIndex,
}: GalleryPageProps) {
  return (
    <div className="relative w-full h-[90vh] min-h-[550px] max-h-[1000px]">
      {images.slice(0, 5).map((img, i) => (
        <AnimatedGalleryImage
          key={img.id || `gallery-page-${pageIndex}-${i}`}
          image={img}
          position={positions[i]}
          index={i}
          artistName={artistName}
          scrollProgress={scrollProgress}
        />
      ))}
    </div>
  );
}

// =============================================================================
// Main Component
// =============================================================================

export function Gallery() {
  const { presskit } = usePresskit();
  const containerRef = useRef<HTMLDivElement>(null);

  const galleryImages = useMemo(() => {
    const images = presskit.media?.gallery ?? [];
    const remaining = images.slice(10);
    return remaining.length > 0 ? remaining.slice(0, 10) : images.slice(-10);
  }, [presskit.media?.gallery]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const page1Progress = useTransform(scrollYProgress, [0, 0.5], [0, 1]);
  const page2Progress = useTransform(scrollYProgress, [0.4, 0.9], [0, 1]);

  if (galleryImages.length < 4) {
    return null;
  }

  const filledImages = [...galleryImages];
  while (filledImages.length < 10) {
    filledImages.push(galleryImages[filledImages.length % galleryImages.length]);
  }

  const page1Images = filledImages.slice(0, 5);
  const page2Images = filledImages.slice(5, 10);

  return (
    <section
      ref={containerRef}
      id="gallery"
      className="relative section-py overflow-hidden max-w-[1500px] mx-auto min-[2500px]:max-w-[1800px]"
    >
      {/* Page 1 */}
      <div className="relative">
        <GalleryPage
          images={page1Images}
          positions={POSITIONS_PAGE_1}
          artistName={presskit.artistName}
          scrollProgress={page1Progress}
          pageIndex={0}
        />
      </div>

      {/* Page 2 */}
      <div className="relative">
        <GalleryPage
          images={page2Images}
          positions={POSITIONS_PAGE_2}
          artistName={presskit.artistName}
          scrollProgress={page2Progress}
          pageIndex={1}
        />
      </div>
    </section>
  );
}

export default Gallery;
