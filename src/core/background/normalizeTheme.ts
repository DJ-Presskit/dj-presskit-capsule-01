/**
 * Theme Normalization
 * Validates and normalizes theme data from API with fallbacks
 */

import {
  PresetId,
  PresetConfig,
  DEFAULT_PRESET_ID,
  isValidPresetId,
  validateConfig,
} from "./backgroundCatalog";

// ============================================================================
// TYPES
// ============================================================================

export interface ApiTheme {
  accentColor: string;
  backgroundTint?: string | null;
  background?: {
    mode?: "preset" | "image" | "video" | "none";
    presetId?: string;
    presetConfig?: Record<string, unknown>;
    imageUrl?: string;
    videoUrl?: string;
    posterUrl?: string;
    overlayOpacity?: number;
    cloudflareStreamId?: string;
  };
  heroPresentation?: "cutout" | "background";
}

export interface NormalizedBackgroundState {
  mode: "preset" | "image" | "video" | "none";
  presetId: PresetId;
  presetConfig: PresetConfig;
  baseColor: string; // HEX color for background
  accentColor: string; // Original accent for UI elements
  imageUrl?: string;
  videoUrl?: string;
  posterUrl?: string;
  cloudflareStreamId?: string;
  overlayOpacity: number;
  disableAnimation: boolean;
}

// ============================================================================
// HELPERS
// ============================================================================

const HEX_COLOR_REGEX = /^#[0-9A-Fa-f]{6}$/;

function isValidHex(color: unknown): color is string {
  return typeof color === "string" && HEX_COLOR_REGEX.test(color);
}

const DEFAULT_ACCENT_COLOR = "#59C6BA";

/**
 * Check if user prefers reduced motion
 * SSR-safe: returns false during SSR
 */
function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
}

// ============================================================================
// MAIN NORMALIZER
// ============================================================================

/**
 * Normalize theme from API into a safe, validated state
 * @param theme Raw theme from API
 * @param checkReducedMotion Whether to check prefers-reduced-motion
 */
export function normalizeTheme(
  theme: ApiTheme | undefined | null,
  checkReducedMotion = true
): NormalizedBackgroundState {
  // Accent color with fallback
  const accentColor = isValidHex(theme?.accentColor)
    ? theme.accentColor
    : DEFAULT_ACCENT_COLOR;

  // Base color: backgroundTint ?? accentColor
  const backgroundTint = theme?.backgroundTint;
  const baseColor = isValidHex(backgroundTint) ? backgroundTint : accentColor;

  // Background mode with fallback
  const rawMode = theme?.background?.mode;
  const mode =
    rawMode === "preset" || rawMode === "image" || rawMode === "video" || rawMode === "none"
      ? rawMode
      : "preset"; // Default to preset

  // Preset ID with fallback
  const rawPresetId = theme?.background?.presetId;
  const presetId = isValidPresetId(rawPresetId) ? rawPresetId : DEFAULT_PRESET_ID;

  // Preset config with validation
  const rawConfig = theme?.background?.presetConfig;
  const presetConfig = validateConfig(presetId, rawConfig);

  // Overlay opacity with clamp
  const rawOpacity = theme?.background?.overlayOpacity;
  const overlayOpacity =
    typeof rawOpacity === "number" ? Math.max(0, Math.min(1, rawOpacity)) : 0.35;

  // Disable animation: check presetConfig OR prefers-reduced-motion
  const configDisabled =
    "disableAnimation" in presetConfig
      ? (presetConfig as { disableAnimation?: boolean }).disableAnimation
      : false;
  const disableAnimation = configDisabled || (checkReducedMotion && prefersReducedMotion());

  return {
    mode,
    presetId,
    presetConfig,
    baseColor,
    accentColor,
    imageUrl: theme?.background?.imageUrl,
    videoUrl: theme?.background?.videoUrl,
    posterUrl: theme?.background?.posterUrl,
    cloudflareStreamId: theme?.background?.cloudflareStreamId,
    overlayOpacity,
    disableAnimation,
  };
}
