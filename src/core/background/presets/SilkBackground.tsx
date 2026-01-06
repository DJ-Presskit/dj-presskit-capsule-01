"use client";

import SilkCanvas from "@/components/AnimatedBackgrounds/silk";

interface SilkBackgroundProps {
  color?: string;
  speed?: number;
  scale?: number;
  noiseIntensity?: number;
  rotation?: number;
}

/**
 * SilkBackground - WebGL silk fabric shader effect
 * Uses @react-three/fiber Canvas for GPU-accelerated rendering
 */
export default function SilkBackground({
  color = "#42a4f5",
  speed = 10,
  scale = 1.5,
  noiseIntensity = 5,
  rotation = 1.9,
}: SilkBackgroundProps) {
  return (
    <div className="w-full h-full">
      <SilkCanvas
        color={color}
        speed={speed}
        scale={scale}
        noiseIntensity={noiseIntensity}
        rotation={rotation}
      />
    </div>
  );
}
