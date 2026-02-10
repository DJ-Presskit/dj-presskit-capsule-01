"use client";
import React from "react";
import CountUp from "@/components/animations/CountUp";
import { OptimizedImage } from "@/components/media";

import { AnimatedSeparator, Text } from "@/components/ui";
import { OutlineTitle } from "@/components/ui/OutlineTitle";
import { usePresskit } from "@/context";
import { useMediaQuery } from "@/hooks";
import { cn } from "@/lib/cn";
import { PresskitPublicView } from "@/types";

/**
 * Layout configuration - adjust these values to control spacing
 * Using margin instead of translate so spacing affects actual layout flow
 */
const LAYOUT_CONFIG = {
  desktop: {
    /** How much the stats block pushes down to overlap the image */
    statsOffset: "mt-[20%]  -mb-[30%]",
    /** Bio box negative margin for overlap effect (responsive) */
    bioOverlap: "-mt-[25%] lg:-mt-[35%] xl:-mt-[40%] 2xl:-mt-[50%] z-20",
  },
  mobile: {
    /** Stats card position from bottom of image */
    statsBottomOffset: "-bottom-16",
    /** Gap after image container to account for stats card overflow */
    contentGap: "mt-24",
  },
} as const;

/**
 * About Section
 * Uses LAYOUT_CONFIG for controllable spacing instead of translate-y
 */
export function About() {
  const { presskit, theme, media } = usePresskit();
  const isMobile = useMediaQuery(760);

  // When hero is video mode, the primary photo should be used for about
  const isHeroVideo =
    theme?.heroMediaType === "video" || (!theme?.heroMediaType && !!theme?.heroVideoCloudflareId);

  const aboutImageUrl =
    isHeroVideo && media?.hero?.url
      ? media.hero.url
      : media?.about?.url || media?.gallery?.[0]?.url || "";

  return (
    <section
      className={cn(
        "section-py section-px space-y-5 max-w-[1500px] min-[2500px]:max-w-[1800px] mx-auto xl:py-0",
        isMobile && "space-y-0",
      )}
    >
      {isMobile ? (
        <MobileLayout presskit={presskit} aboutImageUrl={aboutImageUrl} />
      ) : (
        <DesktopLayout presskit={presskit} aboutImageUrl={aboutImageUrl} />
      )}
    </section>
  );
}

const DesktopLayout = ({
  presskit,
  aboutImageUrl,
}: {
  presskit: PresskitPublicView;
  aboutImageUrl: string;
}) => {
  return (
    <div className="grid grid-cols-4 relative">
      {/* Stats - uses margin-top instead of translate for predictable layout */}
      <div
        className={cn(
          "col-span-2 col-start-3 flex flex-col gap-3 justify-center z-10 w-full",
          LAYOUT_CONFIG.desktop.statsOffset,
        )}
      >
        <InfoBlock
          label="about.yearsOfExperience"
          value={presskit.profile?.yearsOfExperience ?? 0}
        />
        <InfoBlock label="about.totalEvents" value={presskit.profile?.totalEvents ?? 0} />
        <InfoBlock
          label="about.mixedMinutes"
          value={(presskit.profile?.totalEvents ?? 0) * 60 * 4}
        />
      </div>

      {/* Image */}
      <div className="rounded-xl aspect-square relative flex items-center justify-center col-span-3">
        <OptimizedImage src={aboutImageUrl} alt={presskit.artistName} fill className="rounded-xl" />
      </div>

      {/* Info sidebar */}
      <div className="col-span-1 col-start-1 flex flex-col pt-10 gap-5 z-15! bg-background relative h-fit xl:pr-10">
        <AnimatedSeparator direction="vertical" className="absolute left-0 top-0 my-10" />
        <InfoBlock2 title="about.locationLabel" content={presskit.profile?.location ?? ""} />
        <AnimatedSeparator />
        <InfoBlock2
          title="about.genresLabel"
          content={presskit.profile?.genres?.join(" | ") ?? ""}
        />
        <AnimatedSeparator />
        <InfoBlock2 title="about.eventTypesLabel" content={presskit.profile?.eventTypes ?? ""} />
      </div>

      {/* Bio box - uses negative margin instead of translate for predictable layout */}
      <div
        id="about"
        className={cn(
          "col-span-3 col-start-2 p-10 py-15 lg:p-20 z-10! lg:py-25 xl:p-25 xl:py-30 bg-background rounded-[40px] space-y-5 xl:space-y-20 shadow-[-7px_-7px_60px_20px_var(--color-background)]",
          LAYOUT_CONFIG.desktop.bioOverlap,
        )}
      >
        <OutlineTitle title="BIO" outlineTitle="about.title" />
        <Text variant="content" className="text-left">
          {presskit.profile?.longBio ?? ""}
        </Text>
      </div>
    </div>
  );
};

const MobileLayout = ({
  presskit,
  aboutImageUrl,
}: {
  presskit: PresskitPublicView;
  aboutImageUrl: string;
}) => {
  return (
    <>
      <OutlineTitle title="BIO" outlineTitle="about.title" />
      <div id="about">
        <Text variant="content" className="text-left">
          {presskit.profile?.longBio ?? ""}
        </Text>
      </div>

      {/* Image with overlaid stats card */}
      <div className="rounded-xl aspect-square mt-10 mb-8 relative flex items-center justify-center">
        <OptimizedImage src={aboutImageUrl} alt={presskit.artistName} fill className="rounded-xl" />

        {/* Stats card - simplified positioning */}
        <div
          className={cn(
            "absolute left-1/2 -translate-x-1/2 rounded-xl border border-white/25 z-10 backdrop-blur-[22px] w-[95%] py-5 gap-5 px-2 flex flex-wrap items-center justify-center",
            LAYOUT_CONFIG.mobile.statsBottomOffset,
          )}
        >
          <InfoBlock
            label="about.yearsOfExperience"
            value={presskit.profile?.yearsOfExperience ?? 0}
          />
          <InfoBlock label="about.totalEvents" value={presskit.profile?.totalEvents ?? 0} />
          <InfoBlock
            label="about.mixedMinutes"
            value={(presskit.profile?.totalEvents ?? 0) * 60 * 4}
          />
        </div>
      </div>

      {/* Info section - simple gap controlled by LAYOUT_CONFIG */}
      <div className={cn("flex flex-col gap-5", LAYOUT_CONFIG.mobile.contentGap)}>
        <InfoBlock2 title="about.locationLabel" content={presskit.profile?.location ?? ""} />
        <AnimatedSeparator />
        <InfoBlock2
          title="about.genresLabel"
          content={presskit.profile?.genres?.join(" | ") ?? ""}
        />
        <AnimatedSeparator />
        <InfoBlock2 title="about.eventTypesLabel" content={presskit.profile?.eventTypes ?? ""} />
        <AnimatedSeparator />
      </div>
    </>
  );
};

const InfoBlock: React.FC<{ label: string; value: number }> = React.memo(({ label, value }) => {
  return (
    <div className="flex flex-col gap-2 items-center text-center md:flex-row md:gap-5 md:justify-center md:backdrop-blur-[22px] md:border md:border-white/25 md:rounded-xl md:py-5 md:px-5 md:h-[100px] lg:h-[120px] 2xl:h-[150px] md:grid md:grid-cols-3 md:grid-rows-1 lg:px-10 2xl:px-20">
      <Text
        as="h6"
        variant="content"
        className="text-accent font-extrabold text-3xl min-[660px]:text-5xl md:text-3xl md:col-span-2 lg:text-4xl 2xl:text-6xl"
      >
        <CountUp to={value} plus />
      </Text>
      <Text
        as="h6"
        variant="content"
        className="md:col-span-1 uppercase md:text-sm md:text-left md:-translate-x-5 lg:translate-x-0 lg:text-base 2xl:text-lg font-bold"
      >
        {label}
      </Text>
    </div>
  );
});

const InfoBlock2: React.FC<{ title: string; content: string }> = React.memo(
  ({ title, content }) => {
    return (
      <div className="flex flex-col items-center text-center gap-2 py-2 md:text-left! md:items-start md:pl-5 2xl:pl-10">
        <Text as="h5" variant="subtitle" className="text-accent md:text-lg lg:text-xl xl:text-2xl">
          {title}
        </Text>
        <Text variant="content" className="md:text-sm lg:text-base capitalize">
          {content.toLowerCase()}
        </Text>
      </div>
    );
  },
);

export default About;
