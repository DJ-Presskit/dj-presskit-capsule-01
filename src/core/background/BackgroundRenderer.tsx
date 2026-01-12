"use client";

import { useMemo, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { normalizeTheme, type ApiTheme, type NormalizedBackgroundState } from "./normalizeTheme";
import type { DitherConfig, GradientConfig, SilkConfig, WavesConfig } from "./backgroundCatalog";

// Dynamic imports for animated backgrounds (lazy loading)
const DitherNoiseBackground = dynamic(() => import("./presets/DitherNoiseBackground"), {
  ssr: false,
});

const DitherWavesBackground = dynamic(() => import("./presets/DitherWavesBackground"), {
  ssr: false,
});

const SilkBackground = dynamic(() => import("./presets/SilkBackground"), {
  ssr: false,
});

const WavesBackground = dynamic(() => import("./presets/WavesBackground"), {
  ssr: false,
});

// Static imports (safe for SSR)
import VideoBackground from "./presets/VideoBackground";
import GradientBackground from "./presets/GradientBackground";

interface BackgroundRendererProps {
  theme: ApiTheme | undefined | null;
}

/**
 * BackgroundRenderer - Unified background rendering component
 *
 * Renders a full-screen fixed background based on theme configuration.
 * Uses dynamic imports for animated presets to avoid SSR issues and reduce bundle size.
 * Respects prefers-reduced-motion.
 *
 * Place ONCE in layout, before main content.
 */
export function BackgroundRenderer({ theme }: BackgroundRendererProps) {
  // Delay reduced-motion check to avoid hydration mismatch
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Normalize theme (defer reduced-motion check until client)
  const state = useMemo<NormalizedBackgroundState>(() => {
    return normalizeTheme(theme, isClient);
  }, [theme, isClient]);

  // Helper: convert HEX to RGB tuple for dither components
  const hexToRgb = (hex: string): [number, number, number] => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return [0.5, 0.5, 0.5];
    return [
      parseInt(result[1], 16) / 255,
      parseInt(result[2], 16) / 255,
      parseInt(result[3], 16) / 255,
    ];
  };

  // Render nothing for none mode
  if (state.mode === "none") {
    return null;
  }

  // Video background
  if (state.mode === "video") {
    return (
      <VideoBackground
        cloudflareStreamId={state.cloudflareStreamId}
        videoUrl={state.videoUrl}
        posterUrl={state.posterUrl}
        overlayOpacity={state.overlayOpacity}
      />
    );
  }

  // Image background (Legacy/Fallback)
  if (state.mode === "image") {
    return (
      <div
        className="absolute inset-0 -z-10 overflow-hidden pointer-events-none"
        aria-hidden="true"
      >
        <GradientBackground
          colors={[state.baseColor, state.baseColor, "#FFFFFF", state.baseColor]}
        />
      </div>
    );
  }

  // Preset mode - render appropriate preset
  const renderPreset = () => {
    switch (state.presetId) {
      case "dither-noise": {
        const config = state.presetConfig as DitherConfig;
        return (
          <DitherNoiseBackground
            waveSpeed={config.waveSpeed}
            waveFrequency={config.waveFrequency}
            waveAmplitude={config.waveAmplitude}
            waveColor={hexToRgb(state.baseColor)}
            colorNum={config.colorNum}
            pixelSize={config.pixelSize}
            disableAnimation={state.disableAnimation}
            enableMouseInteraction={config.enableMouseInteraction}
            mouseRadius={config.mouseRadius}
          />
        );
      }

      case "dither-waves": {
        const config = state.presetConfig as DitherConfig;
        return (
          <DitherWavesBackground
            waveSpeed={config.waveSpeed}
            waveFrequency={config.waveFrequency}
            waveAmplitude={config.waveAmplitude}
            waveColor={hexToRgb(state.baseColor)}
            colorNum={config.colorNum}
            pixelSize={config.pixelSize}
            disableAnimation={state.disableAnimation}
          />
        );
      }

      case "silk": {
        const config = state.presetConfig as SilkConfig;
        return (
          <SilkBackground
            color={state.baseColor}
            speed={config.speed}
            scale={config.scale}
            noiseIntensity={config.noiseIntensity}
            rotation={config.rotation}
          />
        );
      }

      case "gradient":
      default: {
        const config = state.presetConfig as GradientConfig;
        return (
          <GradientBackground
            colors={[state.baseColor, state.baseColor, "#FFFFFF", state.baseColor]}
            followCursor={config.followCursor}
          />
        );
      }

      case "waves": {
        const config = state.presetConfig as WavesConfig;
        return (
          <WavesBackground
            lineColor={config.lineColor}
            backgroundColor={config.backgroundColor}
            waveSpeedX={config.waveSpeedX}
            waveSpeedY={config.waveSpeedY}
            waveAmpX={config.waveAmpX}
            waveAmpY={config.waveAmpY}
            friction={config.friction}
            tension={config.tension}
            maxCursorMove={config.maxCursorMove}
            xGap={config.xGap}
            yGap={config.yGap}
            baseColor={state.baseColor}
          />
        );
      }
    }
  };

  return (
    <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none" aria-hidden="true">
      {renderPreset()}

      {/* Multi-layer fade overlay for smooth transition */}
      {/* Bottom fade - main transition to background */}
      <div
        className="absolute inset-x-0 bottom-0 h-[40%] pointer-events-none"
        style={{
          background: `linear-gradient(
            to bottom,
            transparent 0%,
            rgba(16, 16, 16, 0.05) 20%,
            rgba(16, 16, 16, 0.15) 35%,
            rgba(16, 16, 16, 0.35) 50%,
            rgba(16, 16, 16, 0.6) 65%,
            rgba(16, 16, 16, 0.85) 80%,
            rgb(16, 16, 16) 100%
          )`,
        }}
      />

      {/* Radial vignette for softer edges all around */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(
            ellipse 120% 100% at 50% 0%,
            transparent 40%,
            rgba(16, 16, 16, 0.3) 70%,
            rgba(16, 16, 16, 0.6) 90%,
            rgb(16, 16, 16) 100%
          )`,
        }}
      />
    </div>
  );
}
