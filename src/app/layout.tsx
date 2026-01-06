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
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={fontClasses}>{children}</body>
    </html>
  );
}
