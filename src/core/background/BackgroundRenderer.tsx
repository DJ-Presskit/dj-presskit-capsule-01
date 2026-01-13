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

      {/* ============================================================= */}
      {/* Multi-layer organic gradient overlays for smooth transitions  */}
      {/* Uses overlapping radial gradients for natural, flowing edges  */}
      {/* ============================================================= */}

      {/* TOP TRANSITION - Multiple radial layers */}
      {/* Layer 1: Wide soft fade from top */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(
            ellipse 200% 50% at 50% -10%,
            rgb(16, 16, 16) 0%,
            rgba(16, 16, 16, 0.9) 20%,
            rgba(16, 16, 16, 0.5) 45%,
            rgba(16, 16, 16, 0.15) 70%,
            transparent 100%
          )`,
        }}
      />

      {/* Layer 2: Asymmetric radial for organic feel - left side */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(
            ellipse 80% 40% at 15% 0%,
            rgba(16, 16, 16, 0.8) 0%,
            rgba(16, 16, 16, 0.3) 50%,
            transparent 100%
          )`,
        }}
      />

      {/* Layer 3: Asymmetric radial for organic feel - right side */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(
            ellipse 90% 35% at 85% 0%,
            rgba(16, 16, 16, 0.7) 0%,
            rgba(16, 16, 16, 0.25) 55%,
            transparent 100%
          )`,
        }}
      />

      {/* BOTTOM TRANSITION - Multiple radial layers */}
      {/* Layer 1: Wide soft fade from bottom */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(
            ellipse 200% 60% at 50% 110%,
            rgb(16, 16, 16) 0%,
            rgba(16, 16, 16, 0.95) 25%,
            rgba(16, 16, 16, 0.6) 50%,
            rgba(16, 16, 16, 0.2) 75%,
            transparent 100%
          )`,
        }}
      />

      {/* Layer 2: Asymmetric radial bottom - left side */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(
            ellipse 70% 45% at 20% 100%,
            rgba(16, 16, 16, 0.85) 0%,
            rgba(16, 16, 16, 0.4) 45%,
            transparent 100%
          )`,
        }}
      />

      {/* Layer 3: Asymmetric radial bottom - right side */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(
            ellipse 85% 50% at 80% 100%,
            rgba(16, 16, 16, 0.8) 0%,
            rgba(16, 16, 16, 0.35) 50%,
            transparent 100%
          )`,
        }}
      />

      {/* SIDE VIGNETTES for contained edges */}
      {/* Left side vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(
            ellipse 40% 100% at -5% 50%,
            rgba(16, 16, 16, 0.6) 0%,
            rgba(16, 16, 16, 0.2) 50%,
            transparent 100%
          )`,
        }}
      />

      {/* Right side vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(
            ellipse 40% 100% at 105% 50%,
            rgba(16, 16, 16, 0.6) 0%,
            rgba(16, 16, 16, 0.2) 50%,
            transparent 100%
          )`,
        }}
      />

      {/* CENTER SPOTLIGHT - keeps the center more visible */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(
            ellipse 80% 60% at 50% 40%,
            transparent 0%,
            transparent 30%,
            rgba(16, 16, 16, 0.1) 100%
          )`,
        }}
      />
    </div>
  );
}
