/**
 * Hero Section
 *
 * Main hero section with artist name, tagline, and gallery images.
 * Simple, clean design without mask animations.
 */

import { clsx } from "clsx";
import Image from "next/image";
import type { PresskitPublicView, PresskitMedia, GalleryImageView } from "@/types";

// ============================================================================
// Types
// ============================================================================

interface HeroProps {
  /** Presskit data from API */
  presskit: PresskitPublicView;
  /** Current language */
  lang?: "es" | "en";
  /** Additional CSS classes */
  className?: string;
}

// ============================================================================
// Component
// ============================================================================

export function Hero({ presskit, lang = "es", className = "" }: HeroProps) {
  const media = presskit.media as PresskitMedia | undefined;
  const gallery = (media?.gallery || []) as GalleryImageView[];
  const aboutImageUrl = typeof media?.about?.image1 === "string" ? media.about.image1 : null;

  // Get up to 3 hero images from gallery
  const heroImages = gallery
    .filter((img) => img?.url)
    .slice(0, 3)
    .map((img) => img.url);

  // Add about image if we need more
  if (heroImages.length < 3 && aboutImageUrl) {
    heroImages.push(aboutImageUrl);
  }

  // Video background if configured
  const videoConfig = presskit.theme?.background;
  const hasVideo =
    videoConfig?.mode === "video" && (videoConfig?.videoUrl || videoConfig?.cloudflareStreamId);
  const videoUrl =
    videoConfig?.videoUrl ||
    (videoConfig?.cloudflareStreamId
      ? `https://customer-${videoConfig.cloudflareStreamId}.cloudflarestream.com/${videoConfig.cloudflareStreamId}/manifest/video.m3u8`
      : undefined);

  return (
    <section
      id="home"
      className={clsx(
        "relative min-h-screen",
        "flex flex-col justify-center",
        "py-16 md:py-24",
        className,
      )}
    >
      {/* Optional Video Background */}
      {hasVideo && videoUrl && (
        <div className="absolute inset-0 -z-20 overflow-hidden">
          <video
            className="absolute inset-0 w-full h-full object-cover"
            src={videoUrl}
            poster={videoConfig?.posterUrl}
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
          />
          <div
            className="absolute inset-0 bg-black"
            style={{ opacity: videoConfig?.overlayOpacity || 0.6 }}
          />
        </div>
      )}

      {/* Hero Content */}
      <div className="container mx-auto px-4">
        {/* Image Grid */}
        {heroImages.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 max-w-5xl mx-auto mb-8">
            {heroImages.map((url, index) => (
              <div
                key={`hero-${index}`}
                className="aspect-[9/16] relative rounded-2xl overflow-hidden bg-black/20"
              >
                <Image
                  src={url}
                  alt={`${presskit.artistName} photo ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                  priority={index === 0}
                  unoptimized
                />
              </div>
            ))}
          </div>
        )}

        {/* Text Content */}
        <div className="text-center">
          {/* Artist Name */}
          <h1
            className={clsx(
              "text-4xl md:text-6xl lg:text-7xl xl:text-8xl",
              "font-bold tracking-tight",
              "mb-4",
            )}
          >
            {presskit.artistName}
          </h1>

          {/* Tagline / Short Bio */}
          {presskit.profile?.shortBio && (
            <p
              className={clsx("text-lg md:text-xl lg:text-2xl", "max-w-2xl mx-auto", "opacity-80")}
            >
              {presskit.profile.shortBio.length > 100
                ? `${presskit.profile.shortBio.slice(0, 100)}...`
                : presskit.profile.shortBio}
            </p>
          )}

          {/* Location */}
          {presskit.profile?.location && (
            <p className={clsx("text-sm md:text-base", "mt-4 opacity-60")}>
              📍 {presskit.profile.location}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

export default Hero;
