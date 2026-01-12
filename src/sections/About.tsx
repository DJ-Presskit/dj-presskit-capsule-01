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

export function About() {
  const { presskit, media } = usePresskit();

  return (
    <section id="about" className="section-py section-px space-y-5">
      <OutlineTitle title="BIO" outlineTitle="about.title" />
      <div className="">
        <Text variant="content" className="text-left">
          {presskit.profile.longBio}
        </Text>
      </div>
      <div className="rounded-xl aspect-square mt-10 relative flex items-center justify-center">
        <OptimizedImage
          src={media?.about?.url || media.gallery[0].url}
          alt={presskit.artistName}
          fill
          className="rounded-xl"
        />

        <div className="absolute -bottom-[50%] min-[400px]:-bottom-[25%] min-[500px]:-bottom-[15%] rounded-xl border border-white/25 z-10 backdrop-blur-[22px] w-[95%] mx-auto py-5 md:py-10 gap-5 md:gap-10 px-2 min-[450px]:flex-wrap flex-col min-[450px]:flex-row  flex items-center justify-center">
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
    </section>
  );
}

const InfoBlock: React.FC<{ label: string; value: number }> = ({ label, value }) => {
  return (
    <div className="flex flex-col items-center text-center">
      <Text variant="content" className="text-accent font-extrabold text-3xl md:text-5xl">
        <CountUp to={value} plus />
      </Text>
      <Text variant="content" className="md:text-xl">
        {label}
      </Text>
    </div>
  );
};

const InfoBlock2: React.FC<{ title: string; content: string }> = ({ title, content }) => {
  return (
    <div className="flex flex-col items-center text-center gap-2 py-2">
      <Text as="h5" variant="subtitle" className="text-accent">
        {title}
      </Text>
      <Text variant="content">{content}</Text>
    </div>
  );
};

export default About;
