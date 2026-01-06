"use client";

import { ExternalLink } from "lucide-react";

interface DJPresskitBannerProps {
  /** Locale for linking to correct landing page */
  locale?: "es" | "en";
  /** Show the large decorative background text */
  showDecorative?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/**
 * DJPresskitBanner - Footer banner with DJ Presskit branding
 *
 * Features:
 * - "Powered by DJ Presskit" with link
 * - Optional decorative large text background
 * - Accent color styling
 *
 * @example
 * <DJPresskitBanner locale="es" />
 */
export function DJPresskitBanner({
  locale = "es",
  showDecorative = true,
  className = "",
}: DJPresskitBannerProps) {
  return (
    <div
      className={`relative w-full flex flex-col items-center justify-center py-8 ${className}`}
    >
      {/* Main banner */}
      <div className="flex items-center justify-center gap-2 w-full max-w-6xl mx-auto px-4">
        <span className="text-xs whitespace-nowrap text-transparent bg-clip-text bg-gradient-to-tl from-gray-200 to-neutral-600 font-medium">
          POWERED BY
        </span>
        <a
          href={`https://dj-presskit.com/${locale}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-xs font-bold text-accent hover:opacity-60 transition-opacity duration-300"
        >
          DJ PRESSKIT
          <ExternalLink size={14} />
        </a>
      </div>

      {/* Decorative background text (desktop only) */}
      {showDecorative && (
        <div className="pointer-events-none hidden md:flex w-full items-center justify-center absolute inset-0 overflow-hidden opacity-10">
          <span
            className="text-[120px] lg:text-[180px] tracking-wider font-bold text-accent select-none"
            style={{
              transform: "translateX(20%)",
              filter: "blur(2px)",
            }}
          >
            DJ PRESSKIT
          </span>
        </div>
      )}
    </div>
  );
}

export default DJPresskitBanner;
