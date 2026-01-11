"use client";

/**
 * Hero Section
 *
 * Uses usePresskit() context for data access.
 * Background + Hero image/video + Artist name.
 */

// External imports
import { clsx } from "clsx";

// Internal imports
import { usePresskit } from "@/context";
import { BackgroundRenderer } from "@/core/background";
import { OptimizedImage } from "@/components/media";

// ============================================================================
// Types
// ============================================================================

interface HeroProps {
  className?: string;
}

// ============================================================================
// Component
// ============================================================================

export function Hero({ className = "" }: HeroProps) {
  // Get data from context
  const { presskit, theme, media } = usePresskit();

  // Use theme from context
  const activeTheme = theme || presskit.theme;
  const heroImageUrl = media?.hero?.url;

  return (
    <section
      id="home"
      className={clsx("relative min-h-screen", "flex items-end justify-center", className)}
    >
      {/* Background - Handles video OR animated preset */}
      <BackgroundRenderer theme={activeTheme} />

      {/* Hero Card */}
      <section className="w-full max-w-7xl aspect-[16/9] rounded-[12px] bg-gray-400 relative flex items-center justify-center overflow-hidden">
        {heroImageUrl && <OptimizedImage src={heroImageUrl} alt={presskit.artistName} fill />}

        {/* Artist name split by words */}
        <div className="flex flex-col items-center absolute -bottom-[25%]">
          {presskit.artistName.split(" ").map((word, index) => (
            <h1
              key={index}
              className="text-[230px]/55 text-white uppercase text-center"
              style={{ fontWeight: 900 }}
            >
              {word}
            </h1>
          ))}
        </div>
      </section>
    </section>
  );
}

export default Hero;
