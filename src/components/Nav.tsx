"use client";

/**
 * Nav Component
 *
 * Sticky navigation bar with glassmorphism blur.
 * Layout: left (LanguageSwitcher) | center (Logo) | right (SocialLinks)
 */

import { clsx } from "clsx";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { SocialLinks } from "./SocialLinks";
import { PresskitLogo } from "@/components/ui/PresskitLogo";

// ============================================================================
// Types
// ============================================================================

interface LogoAsset {
  originalUrl: string;
  width: number;
  height: number;
  format?: string;
  hasAlpha?: boolean;
  version?: string;
  alt?: string;
  variantSm?: { url: string; width: number; height: number };
  variantMd?: { url: string; width: number; height: number };
  variantLg?: { url: string; width: number; height: number };
}

interface Channel {
  platform: string;
  url: string;
  iconUrl?: string;
}

interface NavProps {
  /** Current language */
  lang: "es" | "en";
  /** DJ slug */
  slug: string;
  /** Artist name (for logo fallback) */
  artistName: string;
  /** Logo asset from API */
  logo?: LogoAsset | null;
  /** Social channels from API */
  channels?: Channel[];
  /** Primary email */
  email?: string;
  /** Primary WhatsApp */
  whatsapp?: string;
  /** Whether on proxied domain */
  isProxied?: boolean;
  /** Additional CSS classes */
  className?: string;
}

// ============================================================================
// Component
// ============================================================================

export function Nav({
  lang,
  slug,
  artistName,
  logo,
  channels,
  email,
  whatsapp,
  isProxied = false,
  className = "",
}: NavProps) {
  return (
    <header className={clsx("nav-sticky-blur", "py-3 px-4 md:px-6", className)}>
      <nav className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Left: Language Switcher */}
        <div className="flex-shrink-0 w-24 md:w-32">
          <LanguageSwitcher lang={lang} slug={slug} isProxied={isProxied} />
        </div>

        {/* Center: Logo */}
        <div className="flex-1 flex justify-center">
          <a
            href={isProxied ? `/${lang}` : `/t/${slug}/${lang}`}
            className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-lg"
            aria-label={`${artistName} - Home`}
          >
            <PresskitLogo logo={logo} artistName={artistName} size="sm" className="h-10 md:h-12" />
          </a>
        </div>

        {/* Right: Social Links */}
        <div className="flex-shrink-0 w-24 md:w-32 flex justify-end">
          <SocialLinks channels={channels} email={email} whatsapp={whatsapp} />
        </div>
      </nav>
    </header>
  );
}

export default Nav;
