"use client";

/**
 * LanguageSwitcher Component
 *
 * Minimal language toggle between ES and EN.
 * Uses flag emojis with accessible button.
 */

import { useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { clsx } from "clsx";

// ============================================================================
// Types
// ============================================================================

interface LanguageSwitcherProps {
  /** Current language */
  lang: "es" | "en";
  /** DJ slug for URL building */
  slug: string;
  /** Whether on a proxied domain (clean URLs) */
  isProxied?: boolean;
  /** Additional CSS classes */
  className?: string;
}

// ============================================================================
// Component
// ============================================================================

export function LanguageSwitcher({
  lang,
  slug,
  isProxied = false,
  className = "",
}: LanguageSwitcherProps) {
  const router = useRouter();
  const pathname = usePathname();

  // Toggle to the other language
  const toggleLanguage = useCallback(() => {
    const newLang = lang === "es" ? "en" : "es";

    // Build new URL based on whether we're on a proxied domain
    let newPath: string;

    if (isProxied) {
      // Clean URL: /{lang}/section → /{newLang}/section
      newPath = pathname.replace(`/${lang}`, `/${newLang}`);
    } else {
      // Technical URL: /t/{slug}/{lang}/section → /t/{slug}/{newLang}/section
      newPath = pathname.replace(`/t/${slug}/${lang}`, `/t/${slug}/${newLang}`);
    }

    router.push(newPath);
  }, [lang, slug, isProxied, pathname, router]);

  const isSpanish = lang === "es";

  return (
    <button
      type="button"
      onClick={toggleLanguage}
      className={clsx(
        "group relative flex items-center gap-2 px-3 py-2 rounded-lg",
        "transition-all duration-200",
        "hover:bg-white/10 focus:bg-white/10",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-accent",
        className,
      )}
      aria-label={isSpanish ? "Cambiar a inglés" : "Switch to Spanish"}
    >
      {/* Current flag */}
      <span className="text-lg" aria-hidden="true">
        {isSpanish ? "🇪🇸" : "🇬🇧"}
      </span>

      {/* Current language code */}
      <span className="text-sm font-medium text-white/80 uppercase tracking-wider">{lang}</span>

      {/* Arrow / switch indicator */}
      <span
        className="text-white/40 group-hover:text-accent transition-colors text-xs"
        aria-hidden="true"
      >
        ↔
      </span>

      {/* Target language hint on hover */}
      <span
        className={clsx(
          "absolute right-full mr-2 px-2 py-1 rounded-md text-xs",
          "bg-black/80 text-white whitespace-nowrap",
          "opacity-0 group-hover:opacity-100 transition-opacity duration-200",
          "pointer-events-none",
        )}
      >
        {isSpanish ? "English" : "Español"}
      </span>
    </button>
  );
}

export default LanguageSwitcher;
