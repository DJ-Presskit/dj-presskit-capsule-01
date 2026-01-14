"use client";

import Image from "next/image";
import { useMemo } from "react";

// ============================================================================
// Types
// ============================================================================

interface LogoVariant {
  url: string;
  width: number;
  height: number;
}

interface LogoAsset {
  originalUrl: string;
  width: number;
  height: number;
  format?: string;
  hasAlpha?: boolean;
  version?: string;
  alt?: string;
  variantSm?: LogoVariant;
  variantMd?: LogoVariant;
  variantLg?: LogoVariant;
}

interface PresskitLogoProps {
  /** Logo asset from API */
  logo?: LogoAsset | null;
  /** Artist name (fallback if no logo) */
  artistName: string;
  /** Additional CSS classes */
  className?: string;
  /** Size preset: "sm" | "md" | "lg" - controls clamp sizing */
  size?: "sm" | "md" | "lg";
  /** Object position for image */
  objectPosition?: string;
}

// ============================================================================
// Size Presets (clamp-based responsive sizing)
// ============================================================================

const SIZE_PRESETS = {
  sm: {
    height: "clamp(65px, 6vw, 80px)",
    maxWidth: "min(240px, 40vw)",
    fontSize: "text-xl md:text-2xl",
  },
  md: {
    height: "clamp(80px, 10vw, 120px)",
    maxWidth: "min(360px, 50vw)",
    fontSize: "text-2xl md:text-4xl",
  },
  lg: {
    height: "clamp(100px, 12vw, 160px)",
    maxWidth: "min(420px, 60vw)",
    fontSize: "text-3xl md:text-5xl lg:text-6xl",
  },
} as const;

// ============================================================================
// Component
// ============================================================================

/**
 * PresskitLogo - Responsive logo with clamp-based sizing
 *
 * Features:
 * - Responsive sizing via CSS clamp()
 * - Automatic srcSet generation for responsive images
 * - Fallback to artist name text if no logo
 * - Cache busting via version parameter
 *
 * @example
 * <PresskitLogo logo={presskit.media?.logo} artistName="DJ Name" size="lg" />
 */
export function PresskitLogo({
  logo,
  artistName,
  className = "",
  size = "md",
  objectPosition = "left center",
}: PresskitLogoProps) {
  const sizePreset = SIZE_PRESETS[size];

  // Determine logo URL and alt text
  const { logoUrl, logoAlt, srcSet } = useMemo(() => {
    if (!logo) {
      return { logoUrl: null, logoAlt: "", srcSet: undefined };
    }

    // Best available URL
    const baseUrl = logo.variantLg?.url || logo.variantMd?.url || logo.originalUrl;

    // Add cache busting
    const version = logo.version || "1";
    const url = `${baseUrl}?v=${version}`;

    // Generate srcSet for responsive loading
    const sources: string[] = [];
    if (logo.variantSm?.url) {
      sources.push(`${logo.variantSm.url}?v=${version} ${logo.variantSm.width}w`);
    }
    if (logo.variantMd?.url) {
      sources.push(`${logo.variantMd.url}?v=${version} ${logo.variantMd.width}w`);
    }
    if (logo.variantLg?.url) {
      sources.push(`${logo.variantLg.url}?v=${version} ${logo.variantLg.width}w`);
    }

    return {
      logoUrl: url,
      logoAlt: logo.alt || `${artistName} Logo`,
      srcSet: sources.length > 0 ? sources.join(", ") : undefined,
    };
  }, [logo, artistName]);

  // Fallback: Artist name text
  if (!logoUrl) {
    return (
      <div
        className={`text-white font-bold ${sizePreset.fontSize} ${className}`}
        aria-label={`${artistName} - DJ Presskit`}
      >
        {artistName}
      </div>
    );
  }

  // Logo image with clamp sizing
  return (
    <div
      className={`relative ${className}`}
      style={{
        height: sizePreset.height,
        width: sizePreset.maxWidth,
        minWidth: "120px",
      }}
    >
      <Image
        src={logoUrl}
        alt={logoAlt}
        fill
        sizes="(max-width: 768px) 512px, 1024px"
        style={{
          objectFit: "contain",
          objectPosition: objectPosition,
        }}
        className=""
        priority
        unoptimized // Cloudflare already optimized
        {...(srcSet ? { srcSet } : {})}
      />
    </div>
  );
}

export default PresskitLogo;
