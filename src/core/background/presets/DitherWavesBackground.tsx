"use client";

import DitherWaves from "@/components/AnimatedBackgrounds/dither-waves";

interface DitherWavesBackgroundProps {
  waveSpeed?: number;
  waveFrequency?: number;
  waveAmplitude?: number;
  waveColor?: [number, number, number];
  colorNum?: number;
  pixelSize?: number;
  disableAnimation?: boolean;
}

/**
 * DitherWavesBackground - WebGL wave shader with dithering
 * Uses @react-three/fiber Canvas for GPU-accelerated rendering
 */
export default function DitherWavesBackground(
  props: DitherWavesBackgroundProps
) {
  return (
    <div className="w-full h-full">
      <DitherWaves {...props} />
    </div>
  );
}
