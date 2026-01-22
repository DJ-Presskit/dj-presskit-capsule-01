"use client";

/**
 * Hero Section
 *
 * Uses usePresskit() context for data access.
 * Background + Hero image/video + Artist name.
 *
 * Hero Media Inference:
 * - If heroVideoCloudflareId exists → render video
 * - Else if media.hero.url exists → render image
 * - Else → fallback background
 */

// External imports
import { clsx } from "clsx";

// Internal imports
import { usePresskit } from "@/context";
import { BackgroundRenderer } from "@/core/background";
import { OptimizedImage, CloudflareStreamVideo } from "@/components/media";
import { Text } from "@/components/ui";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { useMediaQuery } from "@/hooks";

const renderHeroMedia = (
  heroMediaType: string | undefined,
  heroVideoCloudflareId: string | undefined,
  heroImageUrl: string | undefined,
  presskit: any,
) => {
  // 1. Explicit type check (prioritized)
  if (heroMediaType === "video") {
    if (heroVideoCloudflareId) {
      return (
        <CloudflareStreamVideo
          uid={heroVideoCloudflareId}
          mode="background"
          allowAudio={true}
          className="absolute inset-0 w-full h-full"
          objectFit="cover"
        />
      );
    }
    // Fallback: If video selected but no ID, try falling back to image
    if (heroImageUrl) {
      return (
        <OptimizedImage src={heroImageUrl} alt={presskit.artistName} fill className="object-top!" />
      );
    }
  }

  if (heroMediaType === "image" && heroImageUrl) {
    return (
      <OptimizedImage src={heroImageUrl} alt={presskit.artistName} fill className="object-top!" />
    );
  }

  if (heroMediaType === "none") {
    return null;
  }

  // 2. Fallback inference (backward compatibility when no explicit type)
  if (!heroMediaType) {
    if (heroVideoCloudflareId) {
      return (
        <CloudflareStreamVideo
          uid={heroVideoCloudflareId}
          mode="background"
          allowAudio={true}
          className="absolute inset-0 w-full h-full"
          objectFit="cover"
        />
      );
    }

    if (heroImageUrl) {
      return (
        <OptimizedImage src={heroImageUrl} alt={presskit.artistName} fill className="object-top!" />
      );
    }
  }

  // Fallback: just the gray background (no media)
  return null;
};

// ============================================================================
// Component
// ============================================================================

export function Hero() {
  // Get data from context
  const { presskit, theme, media } = usePresskit();

  const isMobile = useMediaQuery(1280);
  // Use theme from context
  const activeTheme = theme || presskit.theme;

  const ref = useRef(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // Animation Parameters
  const SCALE_ANIMATION = [1, 1.8];
  const Y_ANIMATION = [isMobile ? "-20vh" : "-60vh", isMobile ? "0vh" : "10vh"]; // Using vh for responsiveness

  const scale = useTransform(scrollYProgress, [0, 1], SCALE_ANIMATION);
  const y = useTransform(scrollYProgress, [0, 1], Y_ANIMATION);

  // Hero media inference: video > image > fallback
  const heroVideoCloudflareId = activeTheme?.heroVideoCloudflareId;
  const heroImageUrl = media?.hero?.url;
  const heroMediaType = activeTheme?.heroMediaType;
  // Render hero media content based on inference
  return (
    <section
      ref={ref}
      id="home"
      className={clsx(
        "relative lg:min-h-screen  pt-[280px] lg:pt-[200px] h-[120dvh] xl:h-[200dvh]!",
        "flex flex-col items-center justify-end overflow-x-hidden",
      )}
    >
      {/* Background - Handles video OR animated preset */}
      <BackgroundRenderer theme={activeTheme} />

      {/* Hero Card */}
      <motion.section
        style={{ scale, y }}
        className="w-[calc(100%-2rem)] lg:max-w-[calc(100%-8rem)] min-[1500px]:max-w-[1500px]! min-[2500px]:max-w-[1800px] aspect-video mt-10 mb-[10%] rounded-xl bg-gray-400 flex items-center justify-center overflow-hidden"
      >
        {renderHeroMedia(heroMediaType, heroVideoCloudflareId, heroImageUrl, presskit)}
      </motion.section>
      {/* Artist name split by words */}
      <motion.div
        style={{ y }}
        className="flex flex-col items-center absolute section-px mix-blend-difference"
      >
        {presskit.artistName.split(" ").map((word, index) => (
          <Text
            variant="title"
            as="h1"
            key={index}
            className="text-[55px]/12 min-[400px]:text-[75px]/15 min-[500px]:text-[85px]/17 md:text-[105px]/21 lg:text-[135px]/28 xl:text-[200px]/40 2xl:text-[250px]/55 min-[2500px]:text-[330px]/70! text-foreground mix-blend-difference"
          >
            {word}
          </Text>
        ))}
      </motion.div>
    </section>
  );
}

export default Hero;
