"use client";

/**
 * BackgroundContext - Phase 2 Enhanced Global State
 *
 * Provides:
 * - Single source of truth for active preset
 * - Section-based visibility tracking via sentinels
 * - Quality level management with priority resolution
 * - Frame clock for single RAF ticker
 * - Invalidate function for R3F presets
 * - Tab visibility pause/resume
 * - Octave weights for uniform-driven shaders
 */

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
  useMemo,
  type ReactNode,
} from "react";
import {
  BackgroundQuality,
  QUALITY_WEIGHTS,
  QUALITY_FPS,
  QUALITY_DPR,
  OCTAVE_WEIGHTS,
  type BackgroundContextValue,
  type FrameClockState,
  type OctaveWeights,
} from "./types";
import { useBackgroundPerformance } from "./hooks/useBackgroundPerformance";
import { DEFAULT_PRESET_ID, PRESET_DEFAULTS, type PresetId } from "./backgroundCatalog";
import { devStats } from "./devStats";

// =============================================================================
// Context
// =============================================================================

const BackgroundContext = createContext<BackgroundContextValue | null>(null);

// =============================================================================
// Hook
// =============================================================================

export function useBackgroundContext(): BackgroundContextValue {
  const ctx = useContext(BackgroundContext);
  if (!ctx) {
    throw new Error("useBackgroundContext must be used within BackgroundProvider");
  }
  return ctx;
}

// =============================================================================
// Provider Props
// =============================================================================

interface BackgroundProviderProps {
  children: ReactNode;
  /** Initial preset from theme */
  initialPreset?: string;
  /** Initial config from theme */
  initialConfig?: Record<string, unknown>;
  /** Tenant-level quality override */
  tenantQualityOverride?: BackgroundQuality;
}

// =============================================================================
// Default Clock State
// =============================================================================

const DEFAULT_CLOCK: FrameClockState = {
  time: 0,
  delta: 0,
  frameId: 0,
  lastFrameTime: 0,
};

// =============================================================================
// Provider
// =============================================================================

export function BackgroundProvider({
  children,
  initialPreset,
  initialConfig,
  tenantQualityOverride,
}: BackgroundProviderProps) {
  // -------------------------------------------------------------------------
  // Use enhanced performance hook
  // -------------------------------------------------------------------------
  const perfProfile = useBackgroundPerformance(tenantQualityOverride);

  // -------------------------------------------------------------------------
  // State
  // -------------------------------------------------------------------------

  const [preset, setPresetInternal] = useState<string>(initialPreset ?? DEFAULT_PRESET_ID);
  const [config, setConfigInternal] = useState<Record<string, unknown>>(
    (initialConfig ?? PRESET_DEFAULTS[DEFAULT_PRESET_ID as PresetId] ?? {}) as Record<
      string,
      unknown
    >,
  );

  // Active sections tracked via sentinels
  const [activeSections, setActiveSections] = useState<Set<string>>(new Set());

  // Tab visibility
  const [isTabVisible, setIsTabVisible] = useState(true);

  // Frame clock state (updated by BackgroundStage RAF)
  const [clock, setClock] = useState<FrameClockState>(DEFAULT_CLOCK);

  // Invalidate function (set by BackgroundStage)
  const invalidateRef = useRef<() => void>(() => {});

  // Last preset signature to prevent spam
  const lastPresetSignature = useRef<string>("");

  // -------------------------------------------------------------------------
  // Derived State
  // -------------------------------------------------------------------------

  const quality = perfProfile.quality;
  const qualityWeight = perfProfile.qualityWeight;
  const octaveWeights = perfProfile.octaveWeights;
  const targetFPS = perfProfile.targetFPS;
  const maxDPR = perfProfile.maxDPR;

  const activeSection = activeSections.size > 0 ? Array.from(activeSections)[0] : null;
  const isPaused = !isTabVisible || activeSections.size === 0 || quality === BackgroundQuality.OFF;

  // -------------------------------------------------------------------------
  // Tab Visibility
  // -------------------------------------------------------------------------

  useEffect(() => {
    if (typeof document === "undefined") return;

    const handleVisibilityChange = () => {
      const visible = document.visibilityState === "visible";
      setIsTabVisible(visible);
      devStats.setIsTabActive(visible);
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  // Update dev stats when quality changes
  useEffect(() => {
    devStats.setQuality(quality);
    devStats.setTargetFPS(targetFPS);
  }, [quality, targetFPS]);

  // Update dev stats when preset changes
  useEffect(() => {
    devStats.setActivePreset(preset);
  }, [preset]);

  // -------------------------------------------------------------------------
  // Actions
  // -------------------------------------------------------------------------

  /**
   * Set active preset with spam prevention
   */
  const setPreset = useCallback((id: string, newConfig?: Record<string, unknown>) => {
    const signature = `${id}:${JSON.stringify(newConfig ?? {})}`;
    if (signature === lastPresetSignature.current) return;

    lastPresetSignature.current = signature;
    setPresetInternal(id);
    if (newConfig) {
      setConfigInternal(newConfig);
    }
  }, []);

  const setQuality = useCallback(() => {
    // Quality is now controlled by useBackgroundPerformance
    // This is a no-op kept for interface compatibility
  }, []);

  const registerSection = useCallback((id: string) => {
    setActiveSections((prev) => new Set(prev).add(id));
  }, []);

  const unregisterSection = useCallback((id: string) => {
    setActiveSections((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }, []);

  const setInvalidate = useCallback((fn: () => void) => {
    invalidateRef.current = fn;
  }, []);

  const invalidate = useCallback(() => {
    invalidateRef.current();
  }, []);

  // Function to update clock (called by BackgroundStage)
  const updateClock = useCallback((newClock: FrameClockState) => {
    setClock(newClock);
  }, []);

  // -------------------------------------------------------------------------
  // Context Value
  // -------------------------------------------------------------------------

  const value = useMemo<BackgroundContextValue>(
    () => ({
      preset,
      config,
      quality,
      activeSection,
      isPaused,
      qualityWeight,
      octaveWeights,
      targetFPS,
      maxDPR,
      clock,
      invalidate,
      setPreset,
      setQuality,
      registerSection,
      unregisterSection,
      setInvalidate,
    }),
    [
      preset,
      config,
      quality,
      activeSection,
      isPaused,
      qualityWeight,
      octaveWeights,
      targetFPS,
      maxDPR,
      clock,
      invalidate,
      setPreset,
      setQuality,
      registerSection,
      unregisterSection,
      setInvalidate,
    ],
  );

  // Expose updateClock to children (BackgroundStage will use this)
  // We use a context-level ref for performance
  const contextWithClock = useMemo(
    () => ({
      ...value,
      _updateClock: updateClock,
    }),
    [value, updateClock],
  );

  return (
    <BackgroundContext.Provider value={contextWithClock as BackgroundContextValue}>
      {children}
    </BackgroundContext.Provider>
  );
}
