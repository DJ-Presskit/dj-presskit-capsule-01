"use client";

/**
 * Releases Section
 *
 * Displays latest releases in a carousel layout.
 * Features:
 * - 2-column layout: title + navigation | carousel
 * - Swiper carousel for releases
 * - Responsive: single column on mobile
 * - Flexible data: TBA dates, optional URLs
 */

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { usePresskit } from "@/context";
import { useI18n } from "@/core/i18n";
import { OutlineTitle } from "@/components/ui/OutlineTitle";
import { ReleasesCarousel, type ReleasesCarouselRef } from "@/components/releases";
import { cn } from "@/lib/cn";
import { GradualBlur } from "@/components/ui";

// =============================================================================
// Subcomponents
// =============================================================================

interface ReleasesNavigationProps {
  onPrev: () => void;
  onNext: () => void;
  className?: string;
}

function ReleasesNavigation({ onPrev, onNext, className }: ReleasesNavigationProps) {
  const { t } = useI18n();

  const buttonClass = "p-2 cursor-pointer text-accent hover:text-accent/80 transition";

  const iconClass = "w-6 h-6 lg:w-8 lg:h-8";

  return (
    <nav className={cn("flex items-center gap-2", className)} aria-label="Carousel navigation">
      <button onClick={onPrev} aria-label={t("common.previous")} className={buttonClass}>
        <ChevronLeft className={iconClass} />
      </button>
      <button onClick={onNext} aria-label={t("common.next")} className={buttonClass}>
        <ChevronRight className={iconClass} />
      </button>
    </nav>
  );
}

// =============================================================================
// Component
// =============================================================================

export function Releases() {
  const { presskit } = usePresskit();
  const carouselRef = useRef<ReleasesCarouselRef>(null);

  // Get releases from presskit
  const releases = presskit.releases?.upcoming ?? [];
  const hasReleases = releases.length > 0;

  // Navigation handlers
  const handlePrev = () => carouselRef.current?.slidePrev();
  const handleNext = () => carouselRef.current?.slideNext();

  // Don't render if no releases
  if (!hasReleases) {
    return null;
  }

  return (
    <section
      id="releases"
      className="max-w-[1500px] min-[2500px]:max-w-[1800px] mx-auto section-py overflow-x-hidden"
    >
      {/* Layout Container */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-0 items-center">
        {/* Left Column (Desktop): Title + Navigation */}
        <div className="space-y-6 z-20 section-px">
          <OutlineTitle
            title="music.lastReleases"
            outlineTitle="music.theNew"
            topOffset="-top-[20%]"
            containerClassName="text-center lg:text-left"
          />

          {/* Desktop Navigation - Hidden on Mobile */}
          {releases.length > 1 && (
            <ReleasesNavigation
              onPrev={handlePrev}
              onNext={handleNext}
              className="hidden lg:flex"
            />
          )}
        </div>

        {/* Right Column: Carousel + Mobile Navigation */}
        <div className="relative lg:pl-10 xl:pl-5 section-px xl:px-0 overflow-hidden">
          <GradualBlur
            position="left"
            strength={0.5}
            width="50px"
            target="parent"
            zIndex={10}
            className="pointer-events-none "
          />
          <ReleasesCarousel
            ref={carouselRef}
            releases={releases}
            className="h-auto -z-10" // Fixed height for 2-row grid on mobile
          />
          <GradualBlur
            position="right"
            strength={0.5}
            width="50px"
            target="parent"
            zIndex={10}
            className="pointer-events-none "
          />
        </div>

        {/* Mobile Navigation - Centered below carousel */}
        {releases.length > 1 && (
          <div className="lg:hidden flex justify-center w-full">
            <ReleasesNavigation onPrev={handlePrev} onNext={handleNext} />
          </div>
        )}
      </div>
    </section>
  );
}

export default Releases;
