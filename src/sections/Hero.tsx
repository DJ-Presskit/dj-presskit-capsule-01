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

// ============================================================================
// Component
// ============================================================================

export function Hero() {
  // Get data from context
  const { presskit, theme, media } = usePresskit();

  // Use theme from context
  const activeTheme = theme || presskit.theme;

  // Hero media inference: video > image > fallback
  const heroVideoCloudflareId = activeTheme?.heroVideoCloudflareId;
  const heroImageUrl = media?.hero?.url;
  const heroMediaType = activeTheme?.heroMediaType;
  // Render hero media content based on inference
  const renderHeroMedia = () => {
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
          <OptimizedImage
            src={heroImageUrl}
            alt={presskit.artistName}
            fill
            className="object-top!"
          />
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
          <OptimizedImage
            src={heroImageUrl}
            alt={presskit.artistName}
            fill
            className="object-top!"
          />
        );
      }
    }

    // Fallback: just the gray background (no media)
    return null;
  };

  return (
    <section
      id="home"
      className={clsx(
        "relative lg:min-h-screen h-full pt-[280px] lg:pt-[200px]",
        "flex flex-col items-center justify-end",
      )}
    >
      {/* Background - Handles video OR animated preset */}
      <BackgroundRenderer theme={activeTheme} />

      {/* Hero Card */}
      <section className="w-[calc(100%-2rem)] lg:max-w-[calc(100%-8rem)] min-[1500px]:max-w-[1500px]! min-[2500px]:max-w-[1800px] aspect-video mt-10 mb-[10%] rounded-xl bg-gray-400 relative flex items-center justify-center overflow-hidden">
        {renderHeroMedia()}
      </section>
      {/* Artist name split by words */}
      <div className="flex flex-col items-center absolute section-px">
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
      </div>
    </section>
  );
}

export default Hero;
