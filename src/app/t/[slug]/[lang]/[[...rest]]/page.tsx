import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { fetchPresskit } from "@/lib/api";
import { ThemeProvider, getAccentColor } from "@/core/theme";
import { BackgroundRenderer } from "@/core/background";
import {
  buildCanonicalUrl,
  buildAlternateLanguages,
  getRobotsMetadata,
  buildIconsMetadata,
  buildOgImages,
  DEFAULT_METADATA,
} from "@/core/seo";
import { normalizeLocale, getDictionary } from "@/core/i18n";
import {
  Container,
  Section,
  Heading,
  Text,
  Stack,
  Badge,
  PresskitLogo,
  DJPresskitBanner,
} from "@/components/ui";
import type { SupportedLang } from "@/types";
import { normalizeSectionKey, SectionScroller } from "@/core/navigation";

// ============================================================================
// Types
// ============================================================================

interface TenantPageProps {
  params: Promise<{
    slug: string;
    lang: string;
    rest?: string[];
  }>;
}

// ============================================================================
// Metadata Generation (MAXIMUM SEO)
// ============================================================================

export async function generateMetadata({
  params,
}: TenantPageProps): Promise<Metadata> {
  const { slug, lang: rawLang, rest } = await params;
  const lang = normalizeLocale(rawLang);

  const { presskit, isNotFound } = await fetchPresskit(
    slug,
    lang as SupportedLang
  );

  // Fallback metadata for errors - still use DJ Presskit defaults
  if (!presskit || isNotFound) {
    return {
      title: "Presskit Not Found",
      description: "DJ Presskit - Electronic Music Press Kit",
      robots: "noindex, nofollow",
      icons: buildIconsMetadata(null),
      openGraph: {
        images: buildOgImages({ alt: "DJ Presskit" }),
      },
    };
  }

  const seo = presskit.seo || {};
  const profile = presskit.profile || {};

  // Build canonical base URL - ensure absolute
  let canonicalBase = seo.canonicalUrl || `https://${slug}.dj-presskit.com`;
  if (!canonicalBase.startsWith("http")) {
    canonicalBase = `https://${canonicalBase}`;
  }
  const cleanCanonicalBase = canonicalBase.replace(/\/$/, "");

  // Safeguard URL constructor
  let metadataBase: URL | undefined;
  try {
    metadataBase = new URL(cleanCanonicalBase);
  } catch (e) {
    console.warn(
      "[SEO] Invalid canonicalUrl for metadataBase:",
      cleanCanonicalBase
    );
    metadataBase = new URL(`https://${slug}.dj-presskit.com`);
  }

  // Build canonical URL for this page
  const canonicalForPage = buildCanonicalUrl({
    canonicalHost: cleanCanonicalBase,
    lang,
    restPath: rest,
  });

  // Build alternates with x-default
  const alternateUrls = buildAlternateLanguages({
    canonicalHost: cleanCanonicalBase,
    restPath: rest,
  });

  // Get logo URL for og:logo
  const logoUrl = (presskit as Record<string, unknown>).media
    ? ((presskit as Record<string, unknown>).media as Record<string, unknown>)
        ?.logo
      ? ((
          (
            (presskit as Record<string, unknown>).media as Record<
              string,
              unknown
            >
          )?.logo as Record<string, unknown>
        )?.originalUrl as string | undefined)
      : undefined
    : undefined;

  // Build OpenGraph images with defaults
  const openGraphImages = buildOgImages({
    url: seo.ogImageUrl,
    width: seo.ogImageWidth,
    height: seo.ogImageHeight,
    alt: `${presskit.artistName} - Press Kit Image`,
  });

  // Determine robots metadata
  const robotsMeta = getRobotsMetadata({
    status: presskit.status,
    publicMode: presskit.publicMode as string | undefined,
    isError: false,
  });

  // Get favicon set from presskit.seo or use defaults
  const faviconSet = (seo as Record<string, unknown>).faviconSet as
    | Record<string, string>
    | undefined;
  const iconsMeta = buildIconsMetadata(faviconSet);

  // Extract Twitter handle from contact channels
  const contact = presskit.contact as
    | { channels?: Array<{ type: string; url: string }> }
    | undefined;
  const twitterChannel = contact?.channels?.find(
    (ch) => ch.type === "twitter" || ch.type === "x"
  );
  const twitterHandle = twitterChannel?.url
    ? `@${twitterChannel.url.split("/").pop()}`
    : undefined;

  return {
    // Base
    metadataBase,

    // Title & Description
    title: seo.title || `${presskit.artistName} | DJ Presskit`,
    description:
      seo.description ||
      profile.shortBio ||
      `${presskit.artistName} - Electronic Music DJ & Producer`,

    // Keywords
    keywords:
      seo.keywords ||
      profile.genres?.join(", ") ||
      "DJ, Producer, Electronic Music",

    // Authors & Publisher
    authors: [{ name: presskit.artistName }],
    creator: presskit.artistName,
    publisher: "DJ Presskit",
    applicationName: DEFAULT_METADATA.siteName,
    category: "Music",

    // Format detection
    formatDetection: {
      telephone: false,
      email: false,
      address: false,
    },

    // OpenGraph
    openGraph: {
      title: seo.title || presskit.artistName,
      description:
        seo.description ||
        profile.shortBio ||
        `${presskit.artistName} - DJ Presskit`,
      type: "profile",
      locale: lang === "es" ? "es_AR" : "en_US",
      alternateLocale: lang === "es" ? ["en_US"] : ["es_AR"],
      firstName: presskit.artistName,
      siteName: DEFAULT_METADATA.siteName,
      images: openGraphImages,
    },

    // Twitter
    twitter: {
      card: "summary_large_image",
      title: seo.title || presskit.artistName,
      description:
        seo.description ||
        profile.shortBio ||
        `${presskit.artistName} - DJ Presskit`,
      images: openGraphImages.map((img) => ({
        url: img.url,
        alt: img.alt,
      })),
      creator: twitterHandle,
    },

    // Robots - comprehensive
    robots: robotsMeta,

    // Alternates with canonical
    alternates: {
      canonical: canonicalForPage,
      languages: alternateUrls,
    },

    // Custom tags (og:logo)
    other: logoUrl ? { "og:logo": logoUrl } : {},

    // Apple Web App
    appleWebApp: {
      capable: true,
      title: presskit.artistName,
      statusBarStyle: "black-translucent",
    },

    // Icons - with DJ's custom or defaults
    icons: iconsMeta,

    // Manifest
    manifest: "/manifest.json",
  };
}

// ============================================================================
// Page Component
// ============================================================================

export default async function TenantPage({ params }: TenantPageProps) {
  const { slug, lang: rawLang, rest } = await params;
  const lang = normalizeLocale(rawLang);
  const dict = getDictionary(lang);

  const { presskit, isNotFound } = await fetchPresskit(
    slug,
    lang as SupportedLang
  );

  // Handle deleted presskit → /gone
  if (presskit?.status === "DELETED") {
    redirect("/gone");
  }

  // Handle not found → /not-found-tenant
  if (!presskit || isNotFound) {
    redirect("/not-found-tenant");
  }

  // Extract data
  const profile = presskit.profile || {};
  const theme = presskit.theme;
  const accent = getAccentColor(theme?.accentColor);

  // Determine section from path (for deep linking)
  const initialSection = normalizeSectionKey(rest);

  // Extract logo for PresskitLogo component
  const media = (presskit as Record<string, unknown>).media as
    | Record<string, unknown>
    | undefined;
  const logo = media?.logo as Record<string, unknown> | undefined;

  return (
    <ThemeProvider accentColor={accent}>
      {/* Section Scroller for deep links */}
      <SectionScroller initialSection={initialSection} />

      {/* Background */}
      <BackgroundRenderer theme={theme} />

      {/* Main content */}
      <main className="relative min-h-screen">
        {/* =========================================================== */}
        {/* HERO SECTION */}
        {/* =========================================================== */}
        <Section
          id="about"
          className="flex items-center justify-center min-h-[80vh] text-center"
        >
          <Container>
            <Stack direction="vertical" gap="xl" align="center">
              {/* Logo / Artist Name */}
              <PresskitLogo
                logo={logo as any}
                artistName={presskit.artistName}
                size="lg"
              />

              {/* Genres */}
              {profile.genres && profile.genres.length > 0 && (
                <Stack
                  direction="horizontal"
                  gap="sm"
                  className="flex-wrap justify-center"
                >
                  {profile.genres.slice(0, 5).map((genre) => (
                    <Badge key={genre} variant="accent">
                      {genre}
                    </Badge>
                  ))}
                </Stack>
              )}

              {/* Short Bio */}
              {profile.shortBio && (
                <Text
                  variant="lead"
                  className="max-w-2xl text-lg md:text-xl opacity-90"
                >
                  {profile.shortBio.length > 250
                    ? `${profile.shortBio.slice(0, 250)}...`
                    : profile.shortBio}
                </Text>
              )}

              {/* Location */}
              {profile.location && (
                <Text
                  variant="muted"
                  className="flex items-center gap-2 text-sm"
                >
                  <span className="text-accent">📍</span> {profile.location}
                </Text>
              )}
            </Stack>
          </Container>
        </Section>

        {/* =========================================================== */}
        {/* CONTENT SECTIONS - Placeholders for skin customization */}
        {/* =========================================================== */}

        <div className="space-y-8 pb-16">
          {/* Events */}
          <Section id="events">
            <Container>
              <div className="glass rounded-2xl p-8">
                <Stack direction="vertical" gap="md">
                  <Heading level={2} className="text-2xl">
                    {dict.events.default}
                  </Heading>
                  <Text variant="muted">{dict.events.noEvents}</Text>
                  <div className="text-xs text-accent/60 font-mono mt-4 p-3 bg-accent/5 rounded-lg">
                    💡 Skin: Render events from{" "}
                    <code>presskit.events.upcoming</code> and{" "}
                    <code>presskit.events.past</code>
                  </div>
                </Stack>
              </div>
            </Container>
          </Section>

          {/* Releases */}
          <Section id="releases">
            <Container>
              <div className="glass rounded-2xl p-8">
                <Stack direction="vertical" gap="md">
                  <Heading level={2} className="text-2xl">
                    {dict.nav.music}
                  </Heading>
                  <Text variant="muted">{dict.music.lastReleases}</Text>
                  <div className="text-xs text-accent/60 font-mono mt-4 p-3 bg-accent/5 rounded-lg">
                    💡 Skin: Render releases from <code>presskit.releases</code>
                  </div>
                </Stack>
              </div>
            </Container>
          </Section>

          {/* Gallery */}
          <Section id="gallery">
            <Container>
              <div className="glass rounded-2xl p-8">
                <Stack direction="vertical" gap="md">
                  <Heading level={2} className="text-2xl">
                    {dict.gallery.title}
                  </Heading>
                  <Text variant="muted">{dict.gallery.noPhotos}</Text>
                  <div className="text-xs text-accent/60 font-mono mt-4 p-3 bg-accent/5 rounded-lg">
                    💡 Skin: Render gallery from{" "}
                    <code>presskit.media.gallery</code>
                  </div>
                </Stack>
              </div>
            </Container>
          </Section>

          {/* SoundCloud */}
          <Section id="soundcloud">
            <Container>
              <div className="glass rounded-2xl p-8">
                <Stack direction="vertical" gap="md">
                  <Heading level={2} className="text-2xl">
                    SoundCloud
                  </Heading>
                  <Text variant="muted">{dict.music.noReleases}</Text>
                  <div className="text-xs text-accent/60 font-mono mt-4 p-3 bg-accent/5 rounded-lg">
                    💡 Skin: Embed SoundCloud player from{" "}
                    <code>presskit.soundcloud</code>
                  </div>
                </Stack>
              </div>
            </Container>
          </Section>

          {/* YouTube */}
          <Section id="youtube">
            <Container>
              <div className="glass rounded-2xl p-8">
                <Stack direction="vertical" gap="md">
                  <Heading level={2} className="text-2xl">
                    YouTube
                  </Heading>
                  <Text variant="muted">{dict.music.noReleases}</Text>
                  <div className="text-xs text-accent/60 font-mono mt-4 p-3 bg-accent/5 rounded-lg">
                    💡 Skin: Embed YouTube videos from{" "}
                    <code>presskit.youtube</code>
                  </div>
                </Stack>
              </div>
            </Container>
          </Section>

          {/* Technical Rider */}
          <Section id="technical-rider">
            <Container>
              <div className="glass rounded-2xl p-8">
                <Stack direction="vertical" gap="md">
                  <Heading level={2} className="text-2xl">
                    {dict.rider.title}
                  </Heading>
                  <Text variant="muted">{dict.rider.noRider}</Text>
                  <div className="text-xs text-accent/60 font-mono mt-4 p-3 bg-accent/5 rounded-lg">
                    💡 Skin: Render rider from <code>presskit.rider</code>
                  </div>
                </Stack>
              </div>
            </Container>
          </Section>

          {/* Contact */}
          <Section id="contact">
            <Container>
              <div className="glass rounded-2xl p-8">
                <Stack direction="vertical" gap="md">
                  <Heading level={2} className="text-2xl">
                    {dict.contact.title}
                  </Heading>
                  <Text variant="muted">{dict.contact.description}</Text>
                  <div className="text-xs text-accent/60 font-mono mt-4 p-3 bg-accent/5 rounded-lg">
                    💡 Skin: Render contact from <code>presskit.contact</code>
                  </div>
                </Stack>
              </div>
            </Container>
          </Section>
        </div>

        {/* =========================================================== */}
        {/* DEV DEBUG - JSON Preview */}
        {/* =========================================================== */}
        {process.env.NODE_ENV === "development" && (
          <Section>
            <Container>
              <details className="glass rounded-2xl p-6">
                <summary className="cursor-pointer text-sm font-medium text-accent">
                  🔧 Debug: API Response (dev only)
                </summary>
                <pre className="mt-4 overflow-auto text-xs text-muted-foreground max-h-[500px]">
                  {JSON.stringify({ slug, lang, rest, presskit }, null, 2)}
                </pre>
              </details>
            </Container>
          </Section>
        )}

        {/* =========================================================== */}
        {/* FOOTER */}
        {/* =========================================================== */}
        <footer className="border-t border-white/5">
          <Container>
            <Stack
              direction="vertical"
              gap="sm"
              align="center"
              className="py-8"
            >
              <Text variant="caption" className="opacity-60">
                © {new Date().getFullYear()} {presskit.artistName}.{" "}
                {dict.footer.allRightsReserved}.
              </Text>
            </Stack>
          </Container>
          <DJPresskitBanner
            locale={lang as "es" | "en"}
            showDecorative={false}
          />
        </footer>
      </main>
    </ThemeProvider>
  );
}
