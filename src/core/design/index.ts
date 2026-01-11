/**
 * Design Module - Fonts, Icons, and Default Assets
 *
 * Centralized font configuration matching legacy capsules.
 * Uses next/font/google for optimized loading.
 */

import { Google_Sans_Flex, Unbounded } from "next/font/google";

// ============================================================================
// Primary Font - Bebas Neue (Headings)
// ============================================================================

export const googleSansFlex = Google_Sans_Flex({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-primary",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

// ============================================================================
// Secondary Font - Unbounded (Special Text)
// ============================================================================

export const unbounded = Unbounded({
  variable: "--font-secondary",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

// ============================================================================
// Font Class String
// ============================================================================

/**
 * Combined font CSS class string for <body>
 * Use: <body className={fontClasses}>
 */
export const fontClasses = `${googleSansFlex.variable} ${unbounded.variable} antialiased`;

// ============================================================================
// Default Assets Paths
// ============================================================================

export const DEFAULT_ASSETS = {
  ogImage: "/og_image.png",
  favicon: "/logos/favicon.ico",
  icon16: "/logos/16x16.png",
  icon32: "/logos/32x32.png",
  icon48: "/logos/48x48.png",
  apple180: "/logos/180x180.png",
  icon192: "/logos/192x192.png",
  icon512: "/logos/512x512.png",
  manifest: "/manifest.json",
} as const;
