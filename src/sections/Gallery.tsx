"use client";

/**
 * Gallery Section
 *
 * Masonry-style grid with scroll animations.
 * 10 images that fill all grid spaces perfectly.
 */

import { useMemo, useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { usePresskit } from "@/context";
import { OptimizedImage } from "@/components/media";
import { cn } from "@/lib/cn";

// =============================================================================
// Grid Pattern - 10 images perfectly filling a 4x6 grid
// =============================================================================

/**
 * Grid spans for 10 images in a 4-column desktop / 2-column mobile layout
 * Each image has [colSpan, rowSpan] - designed to fill all spaces
 */
const GRID_PATTERN: Array<{ col: string; row: string; mobileCol?: string; mobileRow?: string }> = [
  // Row 1-2: Large feature + 2 stacked
  { col: "lg:col-span-2", row: "lg:row-span-2", mobileCol: "col-span-2", mobileRow: "row-span-2" }, // 0: Large
  { col: "lg:col-span-1", row: "lg:row-span-1", mobileCol: "col-span-1", mobileRow: "row-span-1" }, // 1
  { col: "lg:col-span-1", row: "lg:row-span-1", mobileCol: "col-span-1", mobileRow: "row-span-1" }, // 2
  // Row 2-3
  { col: "lg:col-span-1", row: "lg:row-span-2", mobileCol: "col-span-1", mobileRow: "row-span-2" }, // 3: Tall
  { col: "lg:col-span-1", row: "lg:row-span-1", mobileCol: "col-span-1", mobileRow: "row-span-1" }, // 4
  // Row 3-4
  { col: "lg:col-span-2", row: "lg:row-span-1", mobileCol: "col-span-2", mobileRow: "row-span-1" }, // 5: Wide
  { col: "lg:col-span-1", row: "lg:row-span-1", mobileCol: "col-span-1", mobileRow: "row-span-1" }, // 6
  { col: "lg:col-span-1", row: "lg:row-span-1", mobileCol: "col-span-1", mobileRow: "row-span-1" }, // 7
  // Row 4-5
  { col: "lg:col-span-1", row: "lg:row-span-2", mobileCol: "col-span-1", mobileRow: "row-span-2" }, // 8: Tall
  { col: "lg:col-span-1", row: "lg:row-span-2", mobileCol: "col-span-1", mobileRow: "row-span-2" }, // 9: Tall
];

// =============================================================================
// Animated Grid Item
// =============================================================================

interface AnimatedGridItemProps {
  image: { url: string; id?: string };
  index: number;
  artistName: string;
  pattern: (typeof GRID_PATTERN)[number];
}

function AnimatedGridItem({ image, index, artistName, pattern }: AnimatedGridItemProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });

  // Stagger delay based on index
  const delay = index * 0.08;

  return (
    <motion.div
      ref={ref}
      className={cn(
        "relative rounded-xl overflow-hidden group",
        pattern.mobileCol,
        pattern.mobileRow,
        pattern.col,
        pattern.row,
      )}
      initial={{ opacity: 0, y: 60, scale: 0.95 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 60, scale: 0.95 }}
      transition={{
        duration: 0.6,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
    >
      <OptimizedImage
        src={image.url}
        alt={`${artistName} gallery ${index + 1}`}
        fill
        sizesPreset="gallery"
        loadingStrategy={index < 4 ? "eager" : "lazy"}
        className="object-cover transition-transform duration-700 group-hover:scale-110"
      />
      {/* Hover overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </motion.div>
  );
}

// =============================================================================
// Component
// =============================================================================

export function Gallery() {
  const { presskit } = usePresskit();

  // Get the last 10 images (or all if less than 10)
  const galleryImages = useMemo(() => {
    const images = presskit.media?.gallery ?? [];
    // Skip the first 10 (used by carousel), take remaining
    const remaining = images.slice(10);
    return remaining.length > 0 ? remaining.slice(0, 10) : images.slice(-10);
  }, [presskit.media?.gallery]);

  if (galleryImages.length < 4) {
    return null;
  }

  // Fill to exactly 10 images by repeating if needed
  const filledImages = [...galleryImages];
  while (filledImages.length < 10) {
    filledImages.push(galleryImages[filledImages.length % galleryImages.length]);
  }

  return (
    <section
      id="gallery"
      className="max-w-[1500px] min-[2500px]:max-w-[1800px] mx-auto section-py section-px"
    >
      {/* Masonry-style Grid */}
      <div
        className={cn(
          "grid gap-3 lg:gap-4",
          // 2 columns mobile, 4 columns desktop
          "grid-cols-2 lg:grid-cols-4",
          // Row height: larger on desktop
          "auto-rows-[120px] md:auto-rows-[160px] lg:auto-rows-[180px] xl:auto-rows-[220px] 2xl:auto-rows-[260px]",
        )}
      >
        {filledImages.slice(0, 10).map((img, i) => (
          <AnimatedGridItem
            key={img.id || `gallery-${i}`}
            image={img}
            index={i}
            artistName={presskit.artistName}
            pattern={GRID_PATTERN[i]}
          />
        ))}
      </div>
    </section>
  );
}

export default Gallery;
