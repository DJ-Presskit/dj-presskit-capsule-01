import type { Metadata } from "next";
import { Container, Section, Heading, Text, Stack } from "@/components/ui";
import { AlertTriangle } from "lucide-react";
import {
  buildIconsMetadata,
  buildOgImages,
  DEFAULT_METADATA,
} from "@/core/seo";

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
      <Container>
        <Section className="text-center">
          <Stack direction="vertical" gap="lg" align="center">
            <div className="p-4 rounded-full bg-accent/10">
              <AlertTriangle className="h-12 w-12 text-accent" />
            </div>

            <Heading level={1}>Presskit Not Found</Heading>

            <Text variant="muted" className="max-w-md">
              The presskit you are looking for does not exist or is not
              available. Please check the URL and try again.
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
