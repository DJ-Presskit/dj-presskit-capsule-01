"use client";

/**
 * useScrollProgress Hook
 *
 * Tracks scroll position and provides scroll state for animations.
 * SSR-safe with debounced scroll handling.
 *
 * @example
 * const { scrollY, isScrolled } = useScrollProgress({ threshold: 50 });
 */

import { useState, useEffect, useCallback } from "react";

// ============================================================================
// Types
// ============================================================================

interface UseScrollProgressOptions {
  /** Scroll threshold in pixels to trigger isScrolled state (default: 50) */
  threshold?: number;
  /** Debounce delay in ms (default: 10) */
  debounceMs?: number;
}

interface UseScrollProgressReturn {
  /** Current scroll Y position in pixels */
  scrollY: number;
  /** Whether scroll has passed the threshold */
  isScrolled: boolean;
  /** Scroll progress from 0-1 based on threshold */
  progress: number;
}

// ============================================================================
// Hook
// ============================================================================

export function useScrollProgress({
  threshold = 50,
  debounceMs = 10,
}: UseScrollProgressOptions = {}): UseScrollProgressReturn {
  const [scrollY, setScrollY] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);

  // Check for reduced motion preference
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // SSR guard
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY;
    setScrollY(currentScrollY);
    setIsScrolled(currentScrollY > threshold);
  }, [threshold]);

  useEffect(() => {
    // SSR guard
    if (typeof window === "undefined") return;

    // Initialize on mount
    handleScroll();

    // Debounced scroll handler
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    const debouncedHandler = () => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(handleScroll, debounceMs);
    };

    // Use passive listener for performance
    window.addEventListener("scroll", debouncedHandler, { passive: true });

    return () => {
      window.removeEventListener("scroll", debouncedHandler);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [handleScroll, debounceMs]);

  // Calculate progress (0 to 1) based on threshold
  const progress = prefersReducedMotion ? (isScrolled ? 1 : 0) : Math.min(scrollY / threshold, 1);

  return {
    scrollY,
    isScrolled,
    progress,
  };
}

export default useScrollProgress;
