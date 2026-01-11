import type { Metadata } from "next";
import { buildIconsMetadata, buildOgImages, DEFAULT_METADATA } from "@/core/seo";
import Text from "@/components/ui/Text";

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
    <main className="relative min-h-screen flex flex-col items-center justify-center">
      <Text as="h1" variant="titleOutline" className="text-center">
        404
      </Text>
      <Text as="h1" variant="title" className="text-center">
        Presskit No Longer Available
      </Text>
    </main>
  );
}
