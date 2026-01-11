"use client";

/**
 * Nav Component
 *
 * Sticky navigation bar with glassmorphism blur.
 * Layout Row 1: left (LanguageSwitcher) | right (SocialLinks)
 * Layout Row 2: left (Logo) | right (NavLinks)
 */

import { clsx } from "clsx";
import { SocialLinks } from "./SocialLinks";
import { PresskitLogo } from "@/components/media/PresskitLogo";
import Link from "next/link";
import LanguageSwitcher from "./LanguageSwitcher";
import AnimatedSeparator from "./ui/AnimatedSeparator";
import { getEnabledSections, buildSectionHref, type SupportedLang } from "@/config/navigation";
import Text from "./Text";

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
  /** Navigation sections to display */
  navSections?: string[];
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
  navSections,
  isProxied = false,
  className = "",
}: NavProps) {
  // Get sections from config, filtered by navSections prop if provided
  const sections = getEnabledSections(navSections);

  return (
    <header className={clsx("fixed w-full z-50", className)}>
      {/* Row 1: Language Switcher + Social Links */}
      <div className="flex items-center justify-between mx-auto max-w-7xl py-5">
        {/* Left: Language Switcher */}
        <LanguageSwitcher />

        {/* Right: Social Links */}
        <SocialLinks channels={channels} />
      </div>

      <AnimatedSeparator />

      {/* Row 2: Logo + Nav Links */}
      <div className="flex items-center justify-between mx-auto max-w-7xl py-5">
        {/* Left: Logo */}
        <Link
          href={isProxied ? `/${lang}` : `/t/${slug}/${lang}`}
          aria-label={`${artistName} - Home`}
        >
          <PresskitLogo logo={logo} artistName={artistName} size="sm" />
        </Link>

        {/* Right: Navigation Links */}
        <nav className="flex items-center gap-10 z-10">
          {sections.map((section) => (
            <Link key={section.id} href={buildSectionHref(section.id, lang, { slug, isProxied })}>
              <Text variant="custom" className="text-base text-white hover:text-accent">
                {section.labels[lang]}
              </Text>
          </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

export default Nav;
