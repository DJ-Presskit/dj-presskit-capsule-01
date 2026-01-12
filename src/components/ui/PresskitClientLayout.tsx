"use client";

/**
 * PresskitClientLayout
 *
 * Client-side wrapper that handles the preloader and other
 * client-side layout concerns for the presskit pages.
 */

import { useState, type ReactNode } from "react";
import { Preloader } from "@/components/ui";
interface PresskitClientLayoutProps {
  children: ReactNode;
}

export function PresskitClientLayout({ children }: PresskitClientLayoutProps) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      {/* Preloader - Shows for 2 seconds with glitch font effect */}
      {isLoading && <Preloader onComplete={() => setIsLoading(false)} />}

      {/* Main content - Always rendered for SEO, but hidden during preload */}
      <div
        style={{
          opacity: isLoading ? 0 : 1,
          transition: "opacity 0.2s ease-out",
          transitionDelay: isLoading ? "0ms" : "100ms",
        }}
      >
        {children}
      </div>
    </>
  );
}

export default PresskitClientLayout;
