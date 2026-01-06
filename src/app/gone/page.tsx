import type { Metadata } from "next";
import { Container, Section, Heading, Text, Stack } from "@/components/ui";
import { XCircle } from "lucide-react";
import {
  buildIconsMetadata,
  buildOgImages,
  DEFAULT_METADATA,
} from "@/core/seo";

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
    <main className="min-h-screen flex items-center justify-center">
      <Container>
        <Section className="text-center">
          <Stack direction="vertical" gap="lg" align="center">
            <div className="p-4 rounded-full bg-red-500/10">
              <XCircle className="h-12 w-12 text-red-500" />
            </div>

            <Heading level={1}>Presskit No Longer Available</Heading>

            <Text variant="muted" className="max-w-md">
              This presskit has been permanently removed and is no longer
              available. If you believe this is an error, please contact the
              artist directly.
            </Text>

            <a
              href="https://dj-presskit.com"
              className="inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium bg-white/10 text-white hover:bg-white/20 border border-white/10 transition-all"
            >
              Go to DJ Presskit
            </a>
          </Stack>
        </Section>
      </Container>
    </main>
  );
}
