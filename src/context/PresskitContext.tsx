"use client";

/**
 * PresskitContext
 *
 * Provides presskit data to all components via React Context.
 * Components use usePresskit() hook to access data without prop drilling.
 */

import { createContext, useContext, type ReactNode } from "react";
import type { PresskitPublicView, PresskitTheme, PresskitMedia, PresskitContact } from "@/types";
import type { Dictionary } from "@/core/i18n";

// ============================================================================
// Types
// ============================================================================

export type SupportedLang = "es" | "en";

export interface PresskitContextValue {
  // Core data
  presskit: PresskitPublicView;
  theme: PresskitTheme | undefined;
  media: PresskitMedia | undefined;
  contact: PresskitContact | undefined;

  // Navigation
  lang: SupportedLang;
  slug: string;
  isProxied: boolean;

  // i18n dictionary
  dict: Dictionary;
}

// ============================================================================
// Context
// ============================================================================

const PresskitContext = createContext<PresskitContextValue | null>(null);

// ============================================================================
// Provider
// ============================================================================

interface PresskitProviderProps {
  children: ReactNode;
  value: PresskitContextValue;
}

export function PresskitProvider({ children, value }: PresskitProviderProps) {
  return <PresskitContext.Provider value={value}>{children}</PresskitContext.Provider>;
}

// ============================================================================
// Hook
// ============================================================================

/**
 * Access presskit data from context.
 * Must be used within PresskitProvider.
 *
 * @example
 * const { presskit, lang, theme } = usePresskit();
 */
export function usePresskit(): PresskitContextValue {
  const context = useContext(PresskitContext);

  if (!context) {
    throw new Error("usePresskit must be used within PresskitProvider");
  }

  return context;
}

// ============================================================================
// Exports
// ============================================================================

export default PresskitProvider;
