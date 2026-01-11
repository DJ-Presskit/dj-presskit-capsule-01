"use client";

/**
 * Nav Component
 *
 * Sticky navigation bar.
 * Uses usePresskit() context for data access.
 */

// External imports
import { clsx } from "clsx";
import Link from "next/link";

// Internal imports
import { usePresskit } from "@/context";
import { getEnabledSections, buildSectionHref } from "@/config/navigation";

// Relative imports
import SocialLinks from "./SocialLinks";
import LanguageSwitcher from "./LanguageSwitcher";
import { PresskitLogo } from "../media";
import { Text, AnimatedSeparator } from "../ui";

// ============================================================================
// Types
// ============================================================================

interface NavProps {
  className?: string;
}

// ============================================================================
// Component
// ============================================================================

export function Nav({ className = "" }: NavProps) {
  // Get data from context
  const { presskit, media, contact, lang, slug, isProxied } = usePresskit();

  // Get enabled navigation sections
  const sections = getEnabledSections();

  return (
    <header className={clsx("fixed w-full z-50", className)}>
      {/* Row 1: Language Switcher + Social Links */}
      <div className="flex items-center justify-between mx-auto max-w-7xl py-5">
        <LanguageSwitcher />
        <SocialLinks channels={contact?.channels} />
      </div>

      <AnimatedSeparator />

      {/* Row 2: Logo + Nav Links */}
      <div className="flex items-center justify-between mx-auto max-w-7xl py-5">
        {/* Logo */}
        <Link
          href={isProxied ? `/${lang}` : `/t/${slug}/${lang}`}
          aria-label={`${presskit.artistName} - Home`}
        >
          <PresskitLogo logo={media?.logo} artistName={presskit.artistName} size="sm" />
        </Link>

        {/* Navigation Links */}
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
