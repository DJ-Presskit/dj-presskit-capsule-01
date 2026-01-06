/**
 * Theme Tokens and Utilities
 * 
 * Default values and helpers for theme system
 */

export const DEFAULT_TOKENS = {
  accent: "#59C6BA",
  bg: "#0a0a0a",
  fg: "#ffffff",
  muted: "#1a1a1a",
  mutedFg: "#a3a3a3",
  border: "#262626",
} as const;

/**
 * Apply theme variables inline (for server components)
 */
export function applyThemeVars(accent: string = DEFAULT_TOKENS.accent): React.CSSProperties {
  return {
    "--accent": accent,
    "--bg": DEFAULT_TOKENS.bg,
    "--fg": DEFAULT_TOKENS.fg,
    "--muted": DEFAULT_TOKENS.muted,
    "--muted-fg": DEFAULT_TOKENS.mutedFg,
    "--border": DEFAULT_TOKENS.border,
  } as React.CSSProperties;
}

/**
 * Validate hex color format
 */
export function isValidHex(color: string | undefined | null): color is string {
  if (!color) return false;
  return /^#[0-9A-Fa-f]{6}$/.test(color);
}

/**
 * Get accent color with fallback
 */
export function getAccentColor(color: string | undefined | null): string {
  return isValidHex(color) ? color : DEFAULT_TOKENS.accent;
}
