"use client";
import CountUp from "@/components/animations/CountUp";
import { OptimizedImage } from "@/components/media";
/**
 * About Section
 * Uses useI18n hook for translations
 */

import { AnimatedSeparator, Text } from "@/components/ui";
import { OutlineTitle } from "@/components/ui/OutlineTitle";
import { usePresskit } from "@/context";
import { useMediaQuery } from "@/hooks";
import { cn } from "@/lib/cn";
import { PresskitPublicView } from "@/types";

export function About() {
  const { presskit } = usePresskit();

  const isMobile = useMediaQuery(760);

  return (
    <section
      id="about"
      className={cn(
        "section-py section-px space-y-5 max-w-[1500px] min-[2500px]:max-w-[1800px] mx-auto xl:py-0",
        isMobile && "space-y-0",
      )}
    >
      {isMobile ? <MobileLayout presskit={presskit} /> : <DesktopLayout presskit={presskit} />}
    </section>
  );
}

const DesktopLayout = ({ presskit }: { presskit: PresskitPublicView }) => {
  return (
    <div className="grid grid-cols-4 relative">
      <div className="col-span-2 col-start-3 flex flex-col gap-3 justify-center translate-y-[50%] z-10 w-full">
        <InfoBlock label="about.yearsOfExperience" value={presskit.profile.yearsOfExperience} />
        <InfoBlock label="about.totalEvents" value={presskit.profile.totalEvents} />
        <InfoBlock label="about.mixedMinutes" value={presskit.profile.totalEvents * 60 * 4} />
      </div>
      <div className="rounded-xl aspect-square relative flex items-center justify-center col-span-3">
        <OptimizedImage
          src={presskit.media?.about?.url || presskit.media.gallery[0].url}
          alt={presskit.artistName}
          fill
          className="rounded-xl"
        />
      </div>
      <div className="col-span-1 col-start-1 flex flex-col pt-10 gap-5 z-20 bg-background relative h-fit xl:pr-10 ">
        <AnimatedSeparator direction="vertical" className="absolute left-0 top-0 my-10" />
        <InfoBlock2 title="about.locationLabel" content={presskit.profile.location} />
        <AnimatedSeparator />
        <InfoBlock2 title="about.genresLabel" content={presskit.profile.genres.join(" | ")} />
        <AnimatedSeparator />
        <InfoBlock2 title="about.eventTypesLabel" content={presskit.profile.eventTypes} />
      </div>
      <div className="col-span-3 col-start-2 p-10 py-15 lg:p-20 lg:py-25 xl:p-25 xl:py-30 bg-background rounded-[40px] -translate-y-[30%] xl:-translate-y-[40%] 2xl:-translate-y-[50%] space-y-5 xl:space-y-20 shadow-[-7px_-7px_60px_20px_var(--color-background)]">
        <OutlineTitle title="BIO" outlineTitle="about.title" />
        <Text variant="content" className="text-left">
          {presskit.profile.longBio}
        </Text>
      </div>
    </div>
  );
};

const MobileLayout = ({ presskit }: { presskit: PresskitPublicView }) => {
  return (
    <>
      <OutlineTitle title="BIO" outlineTitle="about.title" />
      <div className="">
        <Text variant="content" className="text-left">
          {presskit.profile.longBio}
        </Text>
      </div>
      <div className="rounded-xl aspect-square mt-10 relative flex items-center justify-center">
        <OptimizedImage
          src={presskit.media?.about?.url || presskit.media.gallery[0].url}
          alt={presskit.artistName}
          fill
          className="rounded-xl"
        />

        <div className="absolute -bottom-[50%] min-[400px]:-bottom-[25%] min-[660px]:-bottom-[10%] min-[500px]:-bottom-[15%] rounded-xl border border-white/25 z-10 backdrop-blur-[22px] w-[95%] mx-auto py-5 md:py-10 gap-5 md:gap-10 px-2 min-[450px]:flex-wrap flex-col min-[450px]:flex-row  flex items-center justify-center">
          <InfoBlock label="about.yearsOfExperience" value={presskit.profile.yearsOfExperience} />
          <InfoBlock label="about.totalEvents" value={presskit.profile.totalEvents} />
          <InfoBlock label="about.mixedMinutes" value={presskit.profile.totalEvents * 60 * 4} />
        </div>
      </div>
      <div className="flex flex-col gap-5 mt-[60%] min-[400px]:mt-[35%] min-[500px]:mt-[25%]">
        <InfoBlock2 title="about.locationLabel" content={presskit.profile.location} />
        <AnimatedSeparator />
        <InfoBlock2 title="about.genresLabel" content={presskit.profile.genres.join(" | ")} />
        <AnimatedSeparator />
        <InfoBlock2 title="about.eventTypesLabel" content={presskit.profile.eventTypes} />
        <AnimatedSeparator />
      </div>
    </>
  );
};

const InfoBlock: React.FC<{ label: string; value: number }> = ({ label, value }) => {
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
};

const InfoBlock2: React.FC<{ title: string; content: string }> = ({ title, content }) => {
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
};

export default About;
