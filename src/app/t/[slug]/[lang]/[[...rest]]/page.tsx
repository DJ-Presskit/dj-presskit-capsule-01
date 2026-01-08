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
import { normalizeSectionKey, SectionScroller } from "@/core/navigation";
import type { SupportedLang, PresskitMedia, PresskitContact } from "@/types";
// Components
import { Nav } from "@/components/Nav";
// Sections
import { Hero } from "@/sections/Hero";
import { About } from "@/sections/About";
import { Gallery } from "@/sections/Gallery";
import { Events } from "@/sections/Events";
import { Releases } from "@/sections/Releases";
import { YouTube } from "@/sections/YouTube";
import { Rider } from "@/sections/Rider";
import { Socials } from "@/sections/Socials";
import { Footer } from "@/sections/Footer";
// Domain
import { getPresskitData } from "@/domain/getPresskitData";

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

export async function generateMetadata({ params }: TenantPageProps): Promise<Metadata> {
  const { slug, lang: rawLang, rest } = await params;
  const lang = normalizeLocale(rawLang);

  const { presskit, isNotFound } = await fetchPresskit(slug, lang as SupportedLang);

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

  // ✅ FIX: metadataBase must use the ACTUAL request origin (from x-tenant-host header)
  // so relative icon/manifest paths resolve to the DJ domain the user is accessing.
  // This is critical for proxied DJ domains where router sets x-tenant-host.
  const { getCanonicalOrigin } = await import("@/core/seo/canonical");
  const requestOrigin = await getCanonicalOrigin();

  // Build canonical base URL from API (for canonical/alternates tags)
  // This may differ from requestOrigin when accessing via different domain
  let canonicalBase = seo.canonicalUrl || `https://${slug}.dj-presskit.com`;
  if (!canonicalBase.startsWith("http")) {
    canonicalBase = `https://${canonicalBase}`;
  }
  const cleanCanonicalBase = canonicalBase.replace(/\/$/, "");

  // metadataBase: use REQUEST origin for resolving relative paths (icons, manifest, etc)
  // This ensures /favicon.ico resolves to the DJ domain user is visiting
  let metadataBase: URL | undefined;
  try {
    metadataBase = new URL(requestOrigin);
  } catch (e) {
    console.warn("[SEO] Invalid requestOrigin for metadataBase:", requestOrigin);
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
    ? ((presskit as Record<string, unknown>).media as Record<string, unknown>)?.logo
      ? ((
          ((presskit as Record<string, unknown>).media as Record<string, unknown>)?.logo as Record<
            string,
            unknown
          >
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
  const twitterChannel = contact?.channels?.find((ch) => ch.type === "twitter" || ch.type === "x");
  const twitterHandle = twitterChannel?.url ? `@${twitterChannel.url.split("/").pop()}` : undefined;

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
    keywords: seo.keywords || profile.genres?.join(", ") || "DJ, Producer, Electronic Music",

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
      description: seo.description || profile.shortBio || `${presskit.artistName} - DJ Presskit`,
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
      description: seo.description || profile.shortBio || `${presskit.artistName} - DJ Presskit`,
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

  const { presskit, isNotFound } = await fetchPresskit(slug, lang as SupportedLang);

  // Handle deleted presskit → /gone
  if (presskit?.status === "DELETED") {
    redirect("/gone");
  }

  // Handle not found → /not-found-tenant
  if (!presskit || isNotFound) {
    redirect("/not-found-tenant");
  }

  // Get accent color for theme
  const theme = presskit.theme;
  const accent = getAccentColor(theme?.accentColor);

  // Determine section from path (for deep linking)
  const initialSection = normalizeSectionKey(rest);

  // Extract media and contact for nav
  const media = presskit.media as PresskitMedia | undefined;
  const logo = media?.logo;
  const contact = presskit.contact as PresskitContact | undefined;

  // Normalize all data into ViewModels using getCapsule01Data
  const pageData = getPresskitData(presskit as Record<string, unknown>);

  return (
    <ThemeProvider accentColor={accent}>
      {/* Section Scroller for deep links */}
      <SectionScroller initialSection={initialSection} />

      {/* Background */}
      <BackgroundRenderer theme={theme} />

      {/* Navigation */}
      <Nav
        lang={lang as "es" | "en"}
        slug={slug}
        artistName={presskit.artistName}
        logo={logo}
        channels={contact?.channels}
        email={contact?.primaryEmail}
        whatsapp={contact?.primaryWhatsapp}
      />

      {/* Main content */}
      <main className="relative min-h-screen">
        {/* Hero */}
        <Hero presskit={presskit} lang={lang as "es" | "en"} />

        {/* Sections */}
        <div className="space-y-8 pb-16">
          <About about={pageData.about} dict={dict} />
          <Events events={pageData.events} dict={dict} />
          <Releases releases={pageData.releases} dict={dict} />
          <YouTube youtube={pageData.youtube} dict={dict} />
          <Gallery gallery={pageData.gallery} dict={dict} />
          <Rider rider={pageData.rider} dict={dict} />
          <Socials socials={pageData.socials} dict={dict} />
        </div>

        {/* DEV DEBUG */}
        {process.env.NODE_ENV === "development" && (
          <div className="container mx-auto p-4">
            <details className="glass rounded-2xl p-6">
              <summary className="cursor-pointer text-sm font-medium text-accent">
                🔧 Debug: ViewModels (dev only)
              </summary>
              <pre className="mt-4 overflow-auto text-xs text-muted-foreground max-h-[500px]">
                {JSON.stringify({ slug, lang, rest, pageData }, null, 2)}
              </pre>
            </details>
          </div>
        )}

        <Footer artistName={presskit.artistName} driveUrl={pageData.contact.driveUrl} dict={dict} />
      </main>
    </ThemeProvider>
  );
}
