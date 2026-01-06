"use client";

import GradientCanvas from "@/components/AnimatedBackgrounds/GradientBackground";

interface GradientBackgroundProps {
  colors?: string[];
  followCursor?: boolean;
}

/**
 * GradientBackground - Animated radial gradient with CSS animations
 * Wraps the Genesis-style gradient with animated layers
 */
export default function GradientBackground({
  colors = ["#c83232", "#dd4aff", "#64dcff", "#b4b432"],
  followCursor = false,
}: GradientBackgroundProps) {
  return (
    <GradientCanvas
      colors={colors}
      followCursor={followCursor}
      containerClassName="w-full h-full"
      className="w-full h-full"
    >
      {/* Empty children - this is just for background */}
      <></>
    </GradientCanvas>
  );
}
