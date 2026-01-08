/**
 * Rider Section - Technical rider display
 */

import { Container, Section, Heading, Stack } from "@/components/ui";
import type { RiderVM } from "../domain/types";
import { RiderItem } from "../components/RiderItem";
import { ExternalLink } from "../components/ExternalLink";
import { EmptyState } from "../components/EmptyState";

interface RiderProps {
  rider: RiderVM;
  dict?: {
    rider?: { title?: string; noRider?: string; download?: string };
  };
}

export function Rider({ rider, dict }: RiderProps) {
  // Empty state
  if (!rider.hasItems) {
    return (
      <Section id="rider">
        <Container>
          <div className="glass rounded-2xl p-8">
            <Stack direction="vertical" gap="md">
              <Heading level={2} className="text-2xl">
                {dict?.rider?.title || "Technical Rider"}
              </Heading>
              <EmptyState
                icon="🎛️"
                title={dict?.rider?.noRider || "No technical requirements listed"}
              />
            </Stack>
          </div>
        </Container>
      </Section>
    );
  }

  return (
    <Section id="rider">
      <Container>
        <div className="glass rounded-2xl p-8">
          <Stack direction="vertical" gap="lg">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <Heading level={2} className="text-2xl">
                {dict?.rider?.title || "Technical Rider"}
              </Heading>

              {/* Download Link */}
              {rider.downloadUrl && (
                <ExternalLink
                  href={rider.downloadUrl}
                  className="px-4 py-2 bg-accent/10 hover:bg-accent/20 rounded-lg text-sm font-medium text-accent"
                >
                  {dict?.rider?.download || "Download Full Rider"}
                </ExternalLink>
              )}
            </div>

            {/* Rider Items */}
            <div className="grid gap-4 md:grid-cols-2">
              {rider.items.map((item) => (
                <RiderItem key={item.id} item={item} />
              ))}
            </div>
          </Stack>
        </div>
      </Container>
    </Section>
  );
}
