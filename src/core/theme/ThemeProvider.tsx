"use client";

import { useEffect, useMemo } from "react";

interface ThemeProviderProps {
  children: React.ReactNode;
  accentColor?: string;
  backgroundColor?: string;
  foregroundColor?: string;
}

// Default DJ Presskit accent color
const DEFAULT_ACCENT = "#59C6BA";
const DEFAULT_BG = "#0a0a0a";
const DEFAULT_FG = "#ffffff";

/**
 * Generate derived colors from accent
 */
function generateDerivedColors(accent: string) {
  // Extract RGB from hex
  const hex = accent.replace("#", "");
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);

  // Generate muted version (darker, less saturated)
  const mutedR = Math.floor(r * 0.1);
  const mutedG = Math.floor(g * 0.1);
  const mutedB = Math.floor(b * 0.1);
  const muted = `#${mutedR.toString(16).padStart(2, "0")}${mutedG
    .toString(16)
    .padStart(2, "0")}${mutedB.toString(16).padStart(2, "0")}`;

  return { muted };
}

/**
 * ThemeProvider - Injects theme CSS variables
 *
 * Sets --accent, --bg, --fg, --muted on document root
 * for use across all components via Tailwind/CSS
 */
export function ThemeProvider({
  children,
  accentColor = DEFAULT_ACCENT,
  backgroundColor = DEFAULT_BG,
  foregroundColor = DEFAULT_FG,
}: ThemeProviderProps) {
  const derived = useMemo(
    () => generateDerivedColors(accentColor),
    [accentColor]
  );

  useEffect(() => {
    const root = document.documentElement;

    // Set theme CSS variables
    root.style.setProperty("--accent", accentColor);
    root.style.setProperty("--bg", backgroundColor);
    root.style.setProperty("--fg", foregroundColor);
    root.style.setProperty("--muted", derived.muted);
    root.style.setProperty("--muted-fg", "#a3a3a3");
    root.style.setProperty("--border", "#262626");

    // Cleanup on unmount
    return () => {
      root.style.removeProperty("--accent");
      root.style.removeProperty("--bg");
      root.style.removeProperty("--fg");
      root.style.removeProperty("--muted");
      root.style.removeProperty("--muted-fg");
      root.style.removeProperty("--border");
    };
  }, [accentColor, backgroundColor, foregroundColor, derived]);

  return <>{children}</>;
}
