"use client";

/**
 * Nav Component
 *
 * Sticky navigation bar with scroll-based animation.
 * Row 1 (socials + language) stays visible always.
 * Row 2 (logo + nav links) collapses with GradualBlur on scroll.
 * Uses usePresskit() context for data access.
 */

// External imports
import { clsx } from "clsx";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";

// Internal imports
import { usePresskit } from "@/context";
import { getEnabledSections, buildSectionHref } from "@/config/navigation";
import { useScrollProgress } from "@/lib/hooks";

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
  /** Scroll threshold in pixels to trigger collapse (default: 80) */
  scrollThreshold?: number;
}

// ============================================================================
// Component
// ============================================================================

export function Nav({ className = "", scrollThreshold = 80 }: NavProps) {
  // Get data from context
  const { presskit, media, contact, lang, slug, isProxied } = usePresskit();

  // Get enabled navigation sections
  const sections = getEnabledSections();

  // Track scroll state
  const { isScrolled } = useScrollProgress({ threshold: scrollThreshold });

  return (
    <header id="nav" className={clsx("fixed w-full z-50", className)}>
      {/* Row 1: Language Switcher + Social Links - Always Visible */}
      <div className="flex items-center justify-between mx-auto max-w-[1500px] min-[2500px]:max-w-[1800px] py-10 lg:py-5 z-50! section-px">
        <LanguageSwitcher />
        <SocialLinks channels={contact?.channels} />
      </div>

      {/* Row 2: Logo + Nav Links - Collapsible on Scroll */}
      <AnimatePresence mode="wait">{!isScrolled && <AnimatedSeparator />}</AnimatePresence>
      <div className="relative section-px">
        <div className="flex items-start lg:items-center justify-between mx-auto max-w-[1500px] min-[2500px]:max-w-[1800px] py-10 lg:py-5">
          {/* Logo */}
          <AnimatePresence mode="wait">
            {!isScrolled && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1 }}
              >
                <Link
                  href={isProxied ? `/${lang}` : `/t/${slug}/${lang}`}
                  aria-label={`${presskit.artistName} - Home`}
                >
                  <PresskitLogo logo={media?.logo} artistName={presskit.artistName} size="sm" />
                </Link>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Links */}
          <nav className="flex flex-col lg:flex-row gap-1 lg:gap-10 items-end lg:items-start  z-10">
            {sections.map((section, idx) => (
              <AnimatePresence key={idx} mode="wait">
                {!isScrolled && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25, delay: idx * 0.08 }}
                  >
                    <Link
                      key={section.id}
                      href={buildSectionHref(section.id, lang, { slug, isProxied })}
                    >
                      <Text
                        as="h5"
                        variant="custom"
                        className="text-base text-white hover:text-accent"
                      >
                        {section.labels[lang]}
                      </Text>
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Nav;
