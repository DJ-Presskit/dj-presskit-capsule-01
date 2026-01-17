"use client";

/**
 * BackgroundStage - Phase 2 Single RAF Ticker
 *
 * ARCHITECTURE:
 * - Mounted ONCE at layout root
 * - Single RAF ticker with FPS throttling
 * - Calls invalidate() on R3F presets at controlled rate
 * - Pauses when: tab hidden, no sections active, or quality=OFF
 *
 * PATTERN: frameloop="demand" + controlled invalidate()
 * Presets NEVER run their own RAF - they only read from context clock
 */

import { Suspense, useEffect, useRef, useCallback } from "react";
import dynamic from "next/dynamic";
import { useBackgroundContext } from "./BackgroundContext";
import { BackgroundQuality, type OctaveWeights, type FrameClockState } from "./types";
import { devStats } from "./devStats";
import type {
  PresetId,
  DitherConfig,
  SilkConfig,
  GradientConfig,
  WavesConfig,
} from "./backgroundCatalog";

// -----------------------------------------------------------------------------
// Dynamic imports for presets (client-only, lazy loaded)
// -----------------------------------------------------------------------------

const DitherNoiseBackground = dynamic(() => import("./presets/DitherNoiseBackground"), {
  ssr: false,
});

const DitherWavesBackground = dynamic(() => import("./presets/DitherWavesBackground"), {
  ssr: false,
});

const SilkBackground = dynamic(() => import("./presets/SilkBackground"), { ssr: false });

const WavesBackground = dynamic(() => import("./presets/WavesBackground"), { ssr: false });

// Static imports
import VideoBackground from "./presets/VideoBackground";
import GradientBackground from "./presets/GradientBackground";

// -----------------------------------------------------------------------------
// Overlay Gradients (quality-scaled)
// -----------------------------------------------------------------------------

interface OverlayGradientsProps {
  quality: BackgroundQuality;
  baseColor?: string;
}

function OverlayGradients({ quality, baseColor = "rgb(16, 16, 16)" }: OverlayGradientsProps) {
  if (quality === BackgroundQuality.OFF) {
    return <div className="absolute inset-0 bg-background pointer-events-none" />;
  }

  if (quality === BackgroundQuality.LOW) {
    return (
      <>
        <div
          className="absolute inset-x-0 top-0 h-[30%] pointer-events-none"
          style={{
            background: `linear-gradient(to bottom, ${baseColor} 0%, transparent 100%)`,
          }}
        />
        <div
          className="absolute inset-x-0 bottom-0 h-[30%] pointer-events-none"
          style={{
            background: `linear-gradient(to top, ${baseColor} 0%, transparent 100%)`,
          }}
        />
      </>
    );
  }

  if (quality === BackgroundQuality.MEDIUM) {
    return (
      <>
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse 200% 50% at 50% -10%, ${baseColor} 0%, rgba(16,16,16,0.5) 45%, transparent 100%)`,
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse 200% 60% at 50% 110%, ${baseColor} 0%, rgba(16,16,16,0.6) 50%, transparent 100%)`,
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse 40% 100% at -5% 50%, rgba(16,16,16,0.5) 0%, transparent 100%), radial-gradient(ellipse 40% 100% at 105% 50%, rgba(16,16,16,0.5) 0%, transparent 100%)`,
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse 80% 60% at 50% 40%, transparent 0%, rgba(16,16,16,0.1) 100%)`,
          }}
        />
      </>
    );
  }

  // HIGH quality - full overlay
  return (
    <>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 200% 50% at 50% -10%, ${baseColor} 0%, rgba(16,16,16,0.9) 20%, rgba(16,16,16,0.5) 45%, rgba(16,16,16,0.15) 70%, transparent 100%)`,
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 80% 40% at 15% 0%, rgba(16,16,16,0.8) 0%, rgba(16,16,16,0.3) 50%, transparent 100%)`,
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 90% 35% at 85% 0%, rgba(16,16,16,0.7) 0%, rgba(16,16,16,0.25) 55%, transparent 100%)`,
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 200% 60% at 50% 110%, ${baseColor} 0%, rgba(16,16,16,0.95) 25%, rgba(16,16,16,0.6) 50%, rgba(16,16,16,0.2) 75%, transparent 100%)`,
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 70% 45% at 20% 100%, rgba(16,16,16,0.85) 0%, rgba(16,16,16,0.4) 45%, transparent 100%)`,
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 85% 50% at 80% 100%, rgba(16,16,16,0.8) 0%, rgba(16,16,16,0.35) 50%, transparent 100%)`,
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 40% 100% at -5% 50%, rgba(16,16,16,0.6) 0%, rgba(16,16,16,0.2) 50%, transparent 100%)`,
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 40% 100% at 105% 50%, rgba(16,16,16,0.6) 0%, rgba(16,16,16,0.2) 50%, transparent 100%)`,
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 80% 60% at 50% 40%, transparent 0%, transparent 30%, rgba(16,16,16,0.1) 100%)`,
        }}
      />
    </>
  );
}

// -----------------------------------------------------------------------------
// Static Fallback
// -----------------------------------------------------------------------------

function StaticFallback({ quality }: { quality: BackgroundQuality }) {
  if (quality === BackgroundQuality.OFF) {
    return <div className="w-full h-full bg-background" />;
  }
  return (
    <div
      className="w-full h-full"
      style={{ background: `linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%)` }}
    />
  );
}

// -----------------------------------------------------------------------------
// Animated Preset Router
// -----------------------------------------------------------------------------

interface AnimatedPresetProps {
  preset: string;
  config: Record<string, unknown>;
  quality: BackgroundQuality;
  octaveWeights: OctaveWeights;
  maxDPR: number;
  isPaused: boolean;
  clock: FrameClockState;
  onInvalidateReady: (invalidateFn: () => void) => void;
}

function AnimatedPreset({
  preset,
  config,
  quality,
  octaveWeights,
  maxDPR,
  isPaused,
  clock,
  onInvalidateReady,
}: AnimatedPresetProps) {
  // Don't render heavy components when OFF
  if (quality === BackgroundQuality.OFF) {
    return <StaticFallback quality={quality} />;
  }

  // Helper: convert HEX to RGB tuple
  const hexToRgb = (hex: string): [number, number, number] => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return [0.5, 0.5, 0.5];
    return [
      parseInt(result[1], 16) / 255,
      parseInt(result[2], 16) / 255,
      parseInt(result[3], 16) / 255,
    ];
  };

  const baseColor = (config as { baseColor?: string }).baseColor ?? "#59C6BA";

  switch (preset as PresetId) {
    case "dither-noise": {
      const c = config as unknown as DitherConfig;
      return (
        <DitherNoiseBackground
          waveSpeed={c.waveSpeed}
          waveFrequency={c.waveFrequency}
          waveAmplitude={c.waveAmplitude}
          waveColor={hexToRgb(baseColor)}
          colorNum={c.colorNum}
          pixelSize={c.pixelSize}
          disableAnimation={isPaused}
          enableMouseInteraction={c.enableMouseInteraction}
          mouseRadius={c.mouseRadius}
        />
      );
    }

    case "dither-waves": {
      const c = config as unknown as DitherConfig;
      return (
        <DitherWavesBackground
          waveSpeed={c.waveSpeed}
          waveFrequency={c.waveFrequency}
          waveAmplitude={c.waveAmplitude}
          waveColor={hexToRgb(baseColor)}
          colorNum={c.colorNum}
          pixelSize={c.pixelSize}
          disableAnimation={isPaused}
        />
      );
    }

    case "silk": {
      const c = config as unknown as SilkConfig;
      return (
        <SilkBackground
          color={baseColor}
          speed={c.speed}
          scale={c.scale}
          noiseIntensity={c.noiseIntensity}
          rotation={c.rotation}
        />
      );
    }

    case "waves": {
      const c = config as unknown as WavesConfig;
      return (
        <WavesBackground
          backgroundColor={c.backgroundColor}
          waveSpeedX={c.waveSpeedX}
          waveSpeedY={c.waveSpeedY}
          waveAmpX={c.waveAmpX}
          waveAmpY={c.waveAmpY}
          friction={c.friction}
          tension={c.tension}
          maxCursorMove={c.maxCursorMove}
          xGap={c.xGap}
          yGap={c.yGap}
          baseColor={baseColor}
        />
      );
    }

    case "gradient":
    default: {
      const c = config as unknown as GradientConfig;
      return (
        <GradientBackground
          colors={[baseColor, baseColor, "#FFFFFF", baseColor]}
          followCursor={c.followCursor}
        />
      );
    }
  }
}

// -----------------------------------------------------------------------------
// Main Component with Single RAF Ticker
// -----------------------------------------------------------------------------

export function BackgroundStage() {
  const ctx = useBackgroundContext();
  const { preset, config, quality, octaveWeights, maxDPR, isPaused, targetFPS, setInvalidate } =
    ctx;

  // Clock state for RAF ticker
  const clockRef = useRef<FrameClockState>({
    time: 0,
    delta: 0,
    frameId: 0,
    lastFrameTime: 0,
  });
  const startTimeRef = useRef<number | null>(null);
  const lastTickTimeRef = useRef(0);
  const rafIdRef = useRef<number>(0);
  const isRunningRef = useRef(false);

  // Invalidate function ref (set by R3F presets)
  const invalidateRef = useRef<() => void>(() => {});

  // Calculate frame interval based on target FPS
  const frameIntervalRef = useRef(1000 / 60);
  useEffect(() => {
    frameIntervalRef.current = targetFPS > 0 ? 1000 / targetFPS : Infinity;
  }, [targetFPS]);

  // -------------------------------------------------------------------------
  // Single RAF Ticker
  // -------------------------------------------------------------------------
  const tick = useCallback((timestamp: DOMHighResTimeStamp) => {
    if (!isRunningRef.current) return;

    // Initialize start time
    if (startTimeRef.current === null) {
      startTimeRef.current = timestamp;
      lastTickTimeRef.current = timestamp;
    }

    // FPS throttling
    const elapsed = timestamp - lastTickTimeRef.current;
    if (elapsed < frameIntervalRef.current) {
      rafIdRef.current = requestAnimationFrame(tick);
      return;
    }

    // Update clock
    const tickStart = performance.now();
    clockRef.current.delta = elapsed / 1000;
    clockRef.current.time = (timestamp - startTimeRef.current) / 1000;
    clockRef.current.frameId++;
    clockRef.current.lastFrameTime = timestamp;
    lastTickTimeRef.current = timestamp - (elapsed % frameIntervalRef.current);

    // Call invalidate to trigger R3F render
    invalidateRef.current();

    // Dev stats
    const tickDuration = performance.now() - tickStart;
    devStats.recordTick(tickDuration);
    devStats.updateSecond(timestamp);

    // Continue loop
    rafIdRef.current = requestAnimationFrame(tick);
  }, []);

  // Start/stop RAF based on shouldAnimate
  const shouldAnimate = !isPaused && quality !== BackgroundQuality.OFF && targetFPS > 0;

  useEffect(() => {
    devStats.setIsAnimating(shouldAnimate);

    if (shouldAnimate) {
      isRunningRef.current = true;
      rafIdRef.current = requestAnimationFrame(tick);
    } else {
      isRunningRef.current = false;
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = 0;
      }
    }

    return () => {
      isRunningRef.current = false;
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = 0;
      }
    };
  }, [shouldAnimate, tick]);

  // Register invalidate setter in context
  const handleInvalidateReady = useCallback(
    (fn: () => void) => {
      invalidateRef.current = fn;
      setInvalidate(fn);
    },
    [setInvalidate],
  );

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none" aria-hidden="true">
      <Suspense fallback={<StaticFallback quality={quality} />}>
        <AnimatedPreset
          preset={preset}
          config={config}
          quality={quality}
          octaveWeights={octaveWeights}
          maxDPR={maxDPR}
          isPaused={isPaused}
          clock={clockRef.current}
          onInvalidateReady={handleInvalidateReady}
        />
      </Suspense>
      <OverlayGradients quality={quality} />
    </div>
  );
}

export default BackgroundStage;
