/**
 * Background Preset Catalog
 * Source of truth for preset configurations.
 * Must stay in sync with API's background-presets.ts
 */

// ============================================================================
// TYPES
// ============================================================================

export type PresetId = "gradient" | "silk" | "dither-waves" | "dither-noise" | "waves";

export interface DitherConfig {
  waveSpeed: number;
  waveFrequency: number;
  waveAmplitude: number;
  colorNum: number;
  pixelSize: number;
  disableAnimation: boolean;
  enableMouseInteraction: boolean;
  mouseRadius: number;
}

export interface SilkConfig {
  speed: number;
  scale: number;
  noiseIntensity: number;
  rotation: number;
}

export interface GradientConfig {
  followCursor: boolean;
}

export interface WavesConfig {
  backgroundColor: string;
  waveSpeedX: number;
  waveSpeedY: number;
  waveAmpX: number;
  waveAmpY: number;
  friction: number;
  tension: number;
  maxCursorMove: number;
  xGap: number;
  yGap: number;
}

export type PresetConfig = DitherConfig | SilkConfig | GradientConfig | WavesConfig;

// ============================================================================
// DEFAULTS
// ============================================================================

export const PRESET_IDS: PresetId[] = ["gradient", "silk", "dither-waves", "dither-noise", "waves"];

export const PRESET_DEFAULTS: Record<PresetId, PresetConfig> = {
  gradient: {
    followCursor: false,
  },
  silk: {
    speed: 5,
    scale: 1,
    noiseIntensity: 3,
    rotation: 1.9,
  },
  "dither-waves": {
    waveSpeed: 0.25,
    waveFrequency: 0.3,
    waveAmplitude: 0.4,
    colorNum: 10,
    pixelSize: 2,
    disableAnimation: false,
    enableMouseInteraction: false,
    mouseRadius: 0.2,
  },
  "dither-noise": {
    waveSpeed: 0.025,
    waveFrequency: 3,
    waveAmplitude: 0.35,
    colorNum: 10,
    pixelSize: 1.2,
    disableAnimation: false,
    enableMouseInteraction: false,
    mouseRadius: 0.2,
  },
  waves: {
    backgroundColor: "transparent",
    waveSpeedX: 0.04,
    waveSpeedY: 0.04,
    waveAmpX: 25,
    waveAmpY: 15,
    friction: 0.84,
    tension: 0.04,
    maxCursorMove: 40,
    xGap: 30,
    yGap: 22,
  },
};

export const DEFAULT_PRESET_ID: PresetId = "waves";

// ============================================================================
// VALIDATION
// ============================================================================

export function isValidPresetId(id: string | undefined): id is PresetId {
  return typeof id === "string" && PRESET_IDS.includes(id as PresetId);
}

/**
 * Validate and normalize preset config, merging with defaults
 */
export function validateConfig(
  presetId: PresetId,
  config: Record<string, unknown> | undefined | null,
): PresetConfig {
  const defaults = PRESET_DEFAULTS[presetId];
  if (!config) return defaults;

  // Merge with defaults, only keeping valid keys
  const validKeys = Object.keys(defaults);
  const merged: Record<string, unknown> = { ...(defaults as unknown as Record<string, unknown>) };

  for (const key of validKeys) {
    const configValue = config[key];
    const defaultValue = (defaults as unknown as Record<string, unknown>)[key];
    if (key in config && typeof configValue === typeof defaultValue) {
      merged[key] = configValue;
    }
  }

  return merged as unknown as PresetConfig;
}
