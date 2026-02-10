import type { Metadata } from "next";
import "@/styles/globals.css";
import { fontClasses } from "@/core/design";

export const metadata: Metadata = {
  title: "DJ Presskit",
  description: "Multi-tenant DJ presskit engine",
};

/**
 * Root layout for the application
 *
 * Applies global fonts from legacy capsules:
 * - Bebas Neue (headings)
 * - Unbounded (special text)
 * - Inter (body/UI)
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://imagedelivery.net" />
      </head>
      <body className={fontClasses}>{children}</body>
    </html>
  );
}
