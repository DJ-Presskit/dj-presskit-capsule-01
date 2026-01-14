"use client";

/**
 * useBackgroundPerformance - Enhanced capability detection hook (Phase 2)
 *
 * Priority resolution:
 * 1. URL param override `?bg=off|low|medium|high` (highest)
 * 2. prefers-reduced-motion (overrides to OFF)
 * 3. Tenant theme override
 * 4. NEXT_PUBLIC_BG_ANIMATIONS env var
 * 5. NEXT_PUBLIC_BG_ANIMATIONS_FPS env var (optional FPS override)
 * 6. Device capability detection fallback
 */

import { useState, useEffect, useMemo } from "react";
import {
  BackgroundQuality,
  QUALITY_WEIGHTS,
  QUALITY_FPS,
  QUALITY_DPR,
  OCTAVE_WEIGHTS,
  parseEnvQuality,
  parseEnvFPS,
  parseUrlQuality,
  type PerformanceProfile,
  type OctaveWeights,
} from "../types";

export function useBackgroundPerformance(tenantOverride?: BackgroundQuality): PerformanceProfile {
  const [profile, setProfile] = useState<PerformanceProfile>(() => ({
    quality: BackgroundQuality.HIGH,
    targetFPS: 60,
    qualityWeight: 1.0,
    octaveWeights: OCTAVE_WEIGHTS[BackgroundQuality.HIGH],
    maxDPR: 2.0,
    isMobile: false,
    isLowPower: false,
    prefersReducedMotion: false,
  }));

  // Parse env vars once (server-safe)
  const envQuality = useMemo(() => parseEnvQuality(), []);
  const envFPS = useMemo(() => parseEnvFPS(), []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // 1. URL param override (highest priority)
    const urlQuality = parseUrlQuality();

    // 2. Reduced motion check (forces OFF)
    const prefersReduced =
      window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;

    // 3. Device detection
    const isMobile = window.matchMedia?.("(pointer: coarse)")?.matches ?? false;
    const cores = navigator.hardwareConcurrency ?? 4;
    const memory = (navigator as { deviceMemory?: number }).deviceMemory ?? 4;
    const isLowPower = cores <= 2 || memory <= 2;

    // Determine quality (priority order)
    let quality: BackgroundQuality;
    if (urlQuality) {
      // URL param is highest priority (for debugging/testing)
      quality = urlQuality;
    } else if (prefersReduced) {
      // Reduced motion forces OFF (accessibility)
      quality = BackgroundQuality.OFF;
    } else if (tenantOverride) {
      // Tenant-level override from theme
      quality = tenantOverride;
    } else if (envQuality) {
      // Environment variable
      quality = envQuality;
    } else if (isLowPower || (isMobile && cores <= 4)) {
      // Low-power device detection
      quality = BackgroundQuality.LOW;
    } else if (isMobile || cores <= 4 || memory <= 4) {
      // Medium capability
      quality = BackgroundQuality.MEDIUM;
    } else {
      // High-end device
      quality = BackgroundQuality.HIGH;
    }

    // Determine FPS (env override or quality-based)
    const targetFPS = envFPS ?? QUALITY_FPS[quality];

    setProfile({
      quality,
      targetFPS,
      qualityWeight: QUALITY_WEIGHTS[quality],
      octaveWeights: OCTAVE_WEIGHTS[quality],
      maxDPR: QUALITY_DPR[quality],
      isMobile,
      isLowPower,
      prefersReducedMotion: prefersReduced,
    });

    // Log for dev diagnostics
    if (process.env.NODE_ENV === "development") {
      console.log("[BG Perf]", {
        urlQuality,
        tenantOverride,
        envQuality,
        envFPS,
        final: quality,
        targetFPS,
        isMobile,
        isLowPower,
      });
    }

    // Listen for reduced motion changes
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        setProfile((prev) => ({
          ...prev,
          quality: BackgroundQuality.OFF,
          targetFPS: 0,
          qualityWeight: 0,
          octaveWeights: OCTAVE_WEIGHTS[BackgroundQuality.OFF],
          prefersReducedMotion: true,
        }));
      }
    };
    mediaQuery.addEventListener?.("change", handleChange);
    return () => mediaQuery.removeEventListener?.("change", handleChange);
  }, [tenantOverride, envQuality, envFPS]);

  return profile;
}

export default useBackgroundPerformance;
