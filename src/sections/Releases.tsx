/**
 * Releases Section - Data-driven music releases
 */

import { Container, Section, Heading, Stack } from "@/components/ui";
import type { ReleasesVM } from "../domain/types";
import { ReleaseCard } from "../components/ReleaseCard";
import { EmptyState } from "../components/EmptyState";

interface ReleasesProps {
  releases: ReleasesVM;
  dict?: {
    music?: { lastReleases?: string; listenOn?: string; noReleases?: string };
  };
}

export function Releases({ releases, dict }: ReleasesProps) {
  // Empty state
  if (!releases.hasReleases) {
    return (
      <Section id="releases">
        <Container>
          <div className="glass rounded-2xl p-8">
            <Stack direction="vertical" gap="md">
              <Heading level={2} className="text-2xl">
                {dict?.music?.lastReleases || "Releases"}
              </Heading>
              <EmptyState icon="💿" title={dict?.music?.noReleases || "No releases yet"} />
            </Stack>
          </div>
        </Container>
      </Section>
    );
  }

  return (
    <Section id="releases">
      <Container>
        <div className="glass rounded-2xl p-8">
          <Stack direction="vertical" gap="lg">
            <Heading level={2} className="text-2xl">
              {dict?.music?.lastReleases || "Releases"}
            </Heading>

            {/* Releases Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {releases.items.map((release) => (
                <ReleaseCard
                  key={release.id}
                  release={release}
                  dict={{ listen: dict?.music?.listenOn }}
                />
              ))}
            </div>
          </Stack>
        </div>
      </Container>
    </Section>
  );
}
