"use client";

import Dither from "@/components/AnimatedBackgrounds/dither-noise";

interface DitherNoiseBackgroundProps {
  waveSpeed?: number;
  waveFrequency?: number;
  waveAmplitude?: number;
  waveColor?: [number, number, number];
  colorNum?: number;
  pixelSize?: number;
  disableAnimation?: boolean;
  enableMouseInteraction?: boolean;
  mouseRadius?: number;
}

/**
 * DitherNoiseBackground - WebGL noise shader with dithering
 * Uses @react-three/fiber Canvas for GPU-accelerated rendering
 */
export default function DitherNoiseBackground(
  props: DitherNoiseBackgroundProps
) {
  return (
    <div className="w-full h-full">
      <Dither {...props} />
    </div>
  );
}
