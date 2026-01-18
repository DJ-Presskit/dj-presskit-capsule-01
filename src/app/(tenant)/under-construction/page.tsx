import type { Metadata } from "next";
import { buildIconsMetadata, buildOgImages, DEFAULT_METADATA } from "@/core/seo";

export const metadata: Metadata = {
  title: "Presskit Under Construction | DJ Presskit",
  description: "This presskit is being prepared.",
  robots: "noindex, nofollow",
  icons: buildIconsMetadata(null),
  openGraph: {
    title: "Presskit Under Construction | DJ Presskit",
    description: "This presskit is being prepared and will be available soon.",
    images: buildOgImages({ alt: "DJ Presskit - Under Construction" }),
    type: "website",
    siteName: DEFAULT_METADATA.siteName,
  },
  twitter: {
    card: "summary",
    title: "Presskit Under Construction | DJ Presskit",
    description: "This presskit is being prepared and will be available soon.",
  },
};

/**
 * Under Construction page
 * Displayed when the presskit doesn't meet minimum content requirements
 */
export default function UnderConstructionPage() {
  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center bg-black gap-6 px-6">
      {/* Construction indicator - matches style from /gone page */}
      <span className="uppercase text-4xl md:text-6xl lg:text-7xl xl:text-7.5xl tracking-[-4px] text-transparent [-webkit-text-stroke:1px_rgba(79,79,79)] text-center">
        🚧
      </span>

      {/* Main title */}
      <h1 className="text-foreground uppercase text-4xl font-black md:text-6xl lg:text-7xl tracking-[-4px] text-center">
        Coming Soon
      </h1>

      {/* Subtitle */}
      <p className="text-neutral-400 text-center max-w-md text-sm md:text-base">
        This presskit is under construction.
      </p>
    </main>
  );
}
