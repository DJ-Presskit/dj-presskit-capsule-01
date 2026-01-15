import type { Metadata } from "next";
import { buildIconsMetadata, buildOgImages, DEFAULT_METADATA } from "@/core/seo";

export const metadata: Metadata = {
  title: "Presskit No Longer Available | DJ Presskit",
  description: "This presskit has been removed.",
  robots: "noindex, nofollow",
  icons: buildIconsMetadata(null),
  openGraph: {
    title: "Presskit No Longer Available | DJ Presskit",
    description: "This presskit has been permanently removed.",
    images: buildOgImages({ alt: "DJ Presskit - Removed" }),
    type: "website",
    siteName: DEFAULT_METADATA.siteName,
  },
  twitter: {
    card: "summary",
    title: "Presskit No Longer Available | DJ Presskit",
    description: "This presskit has been permanently removed.",
  },
};

/**
 * 410-like page for deleted DJs
 * Displayed when the DJ status is DELETED
 */
export default function GonePage() {
  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center bg-black gap-4">
      <span className="uppercase text-4xl md:text-6xl lg:text-7xl xl:text-7.5xl tracking-[-4px] text-transparent [-webkit-text-stroke:1px_rgba(79,79,79)] text-center">
        404
      </span>
      <h1 className="text-foreground uppercase text-4xl md:text-6xl lg:text-7xl tracking-[-4px] text-center">
        Presskit No Longer Available
      </h1>
    </main>
  );
}
