/**
 * Hero Section
 *
 * Minimal hero: centered artist name over BackgroundRenderer.
 * Background handles video or animated preset - no duplicate logic here.
 */

import { clsx } from "clsx";
import { BackgroundRenderer } from "@/core/background";
import type { PresskitPublicView, PresskitTheme } from "@/types";
import { OptimizedImage } from "@/components/media";

// ============================================================================
// Types
// ============================================================================

interface HeroProps {
  /** Presskit data from API */
  presskit: PresskitPublicView;
  /** Theme configuration for background */
  theme?: PresskitTheme;
  /** Current language */
  lang?: "es" | "en";
  /** Additional CSS classes */
  className?: string;
}

// ============================================================================
// Component
// ============================================================================

export function Hero({ presskit, theme, className = "" }: HeroProps) {
  // Use theme prop or fallback to presskit.theme
  const activeTheme = theme || presskit.theme;

  return (
    <section
      id="home"
      className={clsx("relative min-h-screen", "flex items-end justify-center", className)}
    >
      {/* Background - Handles video OR animated preset */}
      <BackgroundRenderer theme={activeTheme} />

      <section className="w-full max-w-7xl aspect-[16/9] rounded-[12px] bg-gray-400 relative flex items-center justify-center overflow-hidden">
        <OptimizedImage src={presskit.media?.hero?.url || ""} alt={presskit.artistName} fill />
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
