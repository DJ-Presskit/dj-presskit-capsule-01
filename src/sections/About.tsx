/**
 * About Section - Data-driven about section
 */

import { Container, Section, Stack, Text, Badge } from "@/components/ui";
import type { AboutVM } from "../domain/types";
import { EmptyState } from "../components/EmptyState";

interface AboutProps {
  about: AboutVM;
  dict?: {
    about?: { title?: string };
    common?: { loading?: string };
  };
}

export function About({ about, dict }: AboutProps) {
  // Empty state
  if (!about.hasContent) {
    return (
      <Section id="about">
        <Container>
          <div className="glass rounded-2xl p-8">
            <EmptyState icon="👤" title="About section coming soon" />
          </div>
        </Container>
      </Section>
    );
  }

  return (
    <Section id="about">
      <Container>
        <div className="glass rounded-2xl p-8">
          <Stack direction="vertical" gap="xl" align="center">
            {/* About Image */}
            {about.aboutImage && (
              <div className="w-48 h-48 rounded-2xl overflow-hidden bg-black/20">
                <img
                  src={about.aboutImage.url}
                  alt={about.aboutImage.alt}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Genres */}
            {about.genres.length > 0 && (
              <Stack direction="horizontal" gap="sm" className="flex-wrap justify-center">
                {about.genres.map((genre) => (
                  <Badge key={genre} variant="accent">
                    {genre}
                  </Badge>
                ))}
              </Stack>
            )}

            {/* Short Bio */}
            {about.shortBio && (
              <Text variant="lead" className="max-w-2xl text-lg md:text-xl opacity-90 text-center">
                {about.shortBio.length > 300
                  ? `${about.shortBio.slice(0, 300)}...`
                  : about.shortBio}
              </Text>
            )}

            {/* Stats Row */}
            <div className="flex flex-wrap justify-center gap-8 text-center">
              {about.yearsOfExperience && about.yearsOfExperience > 0 && (
                <div>
                  <span className="block text-3xl font-bold text-accent">
                    {about.yearsOfExperience}+
                  </span>
                  <span className="text-sm text-muted-foreground">Years</span>
                </div>
              )}
              {about.totalEvents && about.totalEvents > 0 && (
                <div>
                  <span className="block text-3xl font-bold text-accent">{about.totalEvents}+</span>
                  <span className="text-sm text-muted-foreground">Events</span>
                </div>
              )}
            </div>

            {/* Location & Event Types */}
            <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
              {about.location && (
                <span className="flex items-center gap-2">
                  <span className="text-accent">📍</span>
                  {about.location}
                </span>
              )}
              {about.eventTypes && (
                <span className="flex items-center gap-2">
                  <span className="text-accent">🎵</span>
                  {about.eventTypes}
                </span>
              )}
            </div>
          </Stack>
        </div>
      </Container>
    </Section>
  );
}
