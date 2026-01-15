"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { twMerge } from "tailwind-merge";
import { Locale, LOCALES } from "@/core/i18n";
import { OptimizedImage } from "../media";

const flagUrls: Record<Locale, string> = {
  en: "https://imagedelivery.net/TcBqhuC4WbQZX_mSdplq-w/c2d35738-486e-465d-77ce-50bb7779d700/icon",
  es: "https://imagedelivery.net/TcBqhuC4WbQZX_mSdplq-w/df3f9f29-0e58-42a0-806d-a59252ee7d00/icon",
};

function replaceLocale(pathname: string, nextLocale: Locale) {
  const parts = pathname.split("/").filter(Boolean);

  // Handle tenant routes: /t/[slug]/[lang]
  if (parts[0] === "t" && parts.length >= 2) {
    const lastPart = parts[parts.length - 1];
    if (LOCALES.includes(lastPart as Locale)) {
      parts[parts.length - 1] = nextLocale;
    } else {
      parts.push(nextLocale);
    }
    return "/" + parts.join("/");
  }

  // Handle main site routes: /[lang]/... or /
  if (LOCALES.includes((parts[0] as Locale) || ("" as Locale))) {
    parts[0] = nextLocale;
    return parts.join("/") || "/";
  }

  return `/${nextLocale}${pathname === "/" ? "" : pathname}`;
}

export default function LanguageSwitcher({ className = "" }: { className?: string }) {
  const pathname = usePathname() || "/";
  const router = useRouter(); // Initialize router
  const current = useMemo<Locale>(() => {
    // Current locale logic for tenant routes: check last part?
    // Or check 3rd part? /t/slug/lang
    const parts = pathname.split("/").filter(Boolean);
    if (parts[0] === "t" && parts.length >= 2) {
      const last = parts[parts.length - 1];
      return LOCALES.includes(last as Locale) ? (last as Locale) : "es";
    }
    // Main site fallback
    const seg = pathname.split("/")[1] as Locale;
    return LOCALES.includes(seg) ? seg : "es";
  }, [pathname]);

  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (!selectRef.current) return;
      if (!selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const toggleDropdown = () => setIsOpen((prev) => !prev);

  const handleLanguageChange = (locale: Locale) => {
    const nextPath = replaceLocale(pathname, locale);
    setIsOpen(false);
    router.push(nextPath);
  };

  return (
    <div className={twMerge("w-fit", className)}>
      <div className="w-full">
        <div ref={selectRef} className="relative">
          <motion.button
            type="button"
            onMouseEnter={toggleDropdown}
            onClick={toggleDropdown}
            className="flex items-center justify-center gap-2 transition cursor-pointer"
            aria-expanded={isOpen}
            aria-haspopup="listbox"
          >
            <span className="relative h-5 w-8 overflow-hidden rounded">
              <OptimizedImage
                src={flagUrls[current]}
                alt={`${current}-flag`}
                className="object-cover"
                fill
              />
            </span>
            <motion.span animate={{ rotate: isOpen ? 180 : 0 }} className="text-foreground">
              <svg
                width="10"
                height="10"
                viewBox="0 0 12 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2 4.5L6 8.5L10 4.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </motion.span>
          </motion.button>

          <AnimatePresence>
            {isOpen && (
              <motion.ul
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                className="absolute mt-2 origin-top flex flex-col -translate-x-2 z-99"
                role="listbox"
                aria-label="Seleccionar idioma"
              >
                {LOCALES.filter((locale) => locale !== current).map((locale, index) => (
                  <motion.li
                    key={locale}
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.15, delay: index * 0.05 }}
                  >
                    <button
                      type="button"
                      onClick={() => handleLanguageChange(locale)}
                      className={twMerge(
                        "flex items-center justify-center rounded-xl p-2 transition hover:bg-primary/5 cursor-pointer w-full",
                        current === locale && "pointer-events-none bg-primary/10 opacity-60",
                      )}
                      aria-current={current === locale ? "true" : undefined}
                    >
                      <span className="relative h-5 w-8 overflow-hidden rounded">
                        <OptimizedImage
                          src={flagUrls[locale]}
                          alt={`${locale}-flag`}
                          className="object-cover"
                          fill
                        />
                      </span>
                    </button>
                  </motion.li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
