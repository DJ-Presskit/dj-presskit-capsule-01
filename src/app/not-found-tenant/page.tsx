import type { Metadata } from "next";
import { buildIconsMetadata, buildOgImages, DEFAULT_METADATA } from "@/core/seo";
import Text from "@/components/ui/Text";

export const metadata: Metadata = {
  title: "Presskit Not Found | DJ Presskit",
  description: "The requested presskit could not be found.",
  robots: "noindex, nofollow",
  icons: buildIconsMetadata(null),
  openGraph: {
    title: "Presskit Not Found | DJ Presskit",
    description: "The requested presskit could not be found.",
    images: buildOgImages({ alt: "DJ Presskit - Not Found" }),
    type: "website",
    siteName: DEFAULT_METADATA.siteName,
  },
  twitter: {
    card: "summary",
    title: "Presskit Not Found | DJ Presskit",
    description: "The requested presskit could not be found.",
  },
};

/**
 * 404-like page for unknown tenants
 * Displayed when host/slug resolution fails
 */
export default function NotFoundTenantPage() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <Text variant="title" className="text-center">
        Presskit Not Found
      </Text>
    </main>
  );
}
