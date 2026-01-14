/**
 * Background Performance Types
 * Phase 2: Enhanced with octave weights, FPS targets, and frame clock
 */

// =============================================================================
// Quality Levels
// =============================================================================

export enum BackgroundQuality {
  HIGH = "high",
  MEDIUM = "medium",
  LOW = "low",
  OFF = "off",
}

/**
 * Quality weight mapping for uniform-driven shader optimization
 */
export const QUALITY_WEIGHTS: Record<BackgroundQuality, number> = {
  [BackgroundQuality.HIGH]: 1.0,
  [BackgroundQuality.MEDIUM]: 0.5,
  [BackgroundQuality.LOW]: 0.25,
  [BackgroundQuality.OFF]: 0.0,
};

/**
 * Target FPS by quality level (can be overridden by env var)
 */
export const QUALITY_FPS: Record<BackgroundQuality, number> = {
  [BackgroundQuality.HIGH]: 60,
  [BackgroundQuality.MEDIUM]: 30,
  [BackgroundQuality.LOW]: 15,
  [BackgroundQuality.OFF]: 0,
};

/**
 * DPR (device pixel ratio) limits by quality
 * Lower DPR = fewer pixels to shade = faster
 */
export const QUALITY_DPR: Record<BackgroundQuality, number> = {
  [BackgroundQuality.HIGH]: 2.0,
  [BackgroundQuality.MEDIUM]: 1.5,
  [BackgroundQuality.LOW]: 1.0,
  [BackgroundQuality.OFF]: 1.0,
};

// =============================================================================
// Octave Weights for Uniform-Driven FBM
// Shaders keep fixed 6-iteration loops, multiply each by weight
// =============================================================================

export type OctaveWeights = [number, number, number, number, number, number];

export const OCTAVE_WEIGHTS: Record<BackgroundQuality, OctaveWeights> = {
  [BackgroundQuality.HIGH]: [1.0, 0.85, 0.7, 0.55, 0.4, 0.25],
  [BackgroundQuality.MEDIUM]: [1.0, 0.8, 0.5, 0.2, 0.0, 0.0],
  [BackgroundQuality.LOW]: [1.0, 0.5, 0.0, 0.0, 0.0, 0.0],
  [BackgroundQuality.OFF]: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
};

// =============================================================================
// Feature Flags
// =============================================================================

export interface BackgroundFlags {
  enabled: boolean;
  quality: BackgroundQuality;
}

/**
 * Parse NEXT_PUBLIC_BG_ANIMATIONS env var
 */
export function parseEnvQuality(): BackgroundQuality | null {
  const envValue = process.env.NEXT_PUBLIC_BG_ANIMATIONS?.toLowerCase();
  if (!envValue) return null;

  if (envValue === "off" || envValue === "false" || envValue === "0") {
    return BackgroundQuality.OFF;
  }
  if (envValue === "low") return BackgroundQuality.LOW;
  if (envValue === "medium") return BackgroundQuality.MEDIUM;
  if (envValue === "high") return BackgroundQuality.HIGH;

  return null;
}

/**
 * Parse NEXT_PUBLIC_BG_ANIMATIONS_FPS env var
 */
export function parseEnvFPS(): number | null {
  const envValue = process.env.NEXT_PUBLIC_BG_ANIMATIONS_FPS;
  if (!envValue) return null;
  const fps = parseInt(envValue, 10);
  if (fps === 15 || fps === 30 || fps === 60) return fps;
  return null;
}

/**
 * Parse URL param ?bg=off|low|medium|high
 */
export function parseUrlQuality(): BackgroundQuality | null {
  if (typeof window === "undefined") return null;
  const params = new URLSearchParams(window.location.search);
  const bgParam = params.get("bg")?.toLowerCase();
  if (!bgParam) return null;

  if (bgParam === "off" || bgParam === "0") return BackgroundQuality.OFF;
  if (bgParam === "low") return BackgroundQuality.LOW;
  if (bgParam === "medium") return BackgroundQuality.MEDIUM;
  if (bgParam === "high") return BackgroundQuality.HIGH;

  return null;
}

// =============================================================================
// Frame Clock Types
// =============================================================================

export interface FrameClockState {
  /** Current animation time in seconds */
  time: number;
  /** Delta time since last frame in seconds */
  delta: number;
  /** Frame counter */
  frameId: number;
  /** Timestamp of last frame (for throttling) */
  lastFrameTime: number;
}

// =============================================================================
// Context Types
// =============================================================================

export interface BackgroundContextValue {
  /** Current active preset ID */
  preset: string;
  /** Current preset configuration */
  config: Record<string, unknown>;
  /** Current quality level */
  quality: BackgroundQuality;
  /** Currently active section (via sentinel) */
  activeSection: string | null;
  /** True when tab hidden OR no sections active */
  isPaused: boolean;
  /** Weight passed to shaders (0.0-1.0) */
  qualityWeight: number;
  /** Octave weights array for FBM */
  octaveWeights: OctaveWeights;
  /** Target FPS for throttling */
  targetFPS: number;
  /** Max DPR for this quality */
  maxDPR: number;
  /** Frame clock state for presets to read */
  clock: FrameClockState;
  /** Invalidate function for R3F presets (set by stage) */
  invalidate: () => void;

  // Actions
  setPreset: (id: string, config?: Record<string, unknown>) => void;
  setQuality: (quality: BackgroundQuality) => void;
  registerSection: (id: string) => void;
  unregisterSection: (id: string) => void;
  setInvalidate: (fn: () => void) => void;
}

// =============================================================================
// Performance Profile
// =============================================================================

export interface PerformanceProfile {
  quality: BackgroundQuality;
  targetFPS: number;
  qualityWeight: number;
  octaveWeights: OctaveWeights;
  maxDPR: number;
  isMobile: boolean;
  isLowPower: boolean;
  prefersReducedMotion: boolean;
}

// =============================================================================
// Dev Stats (Phase 2 diagnostics)
// =============================================================================

export interface BackgroundDevStats {
  framesRendered: number;
  averageTickMs: number;
  invalidatesPerSecond: number;
  quality: BackgroundQuality;
  targetFPS: number;
  isAnimating: boolean;
  activePreset: string;
  isTabActive: boolean;
}
