/**
 * YouTube Section - Data-driven video embeds
 */

import { Container, Section, Heading, Stack } from "@/components/ui";
import type { YoutubeVM } from "../domain/types";
import { EmbedFrame } from "../components/EmbedFrame";
import { EmptyState } from "../components/EmptyState";

interface YouTubeProps {
  youtube: YoutubeVM;
  dict?: {
    nav?: { music?: string };
  };
}

export function YouTube({ youtube, dict }: YouTubeProps) {
  // Empty state
  if (!youtube.hasVideos) {
    return (
      <Section id="youtube">
        <Container>
          <div className="glass rounded-2xl p-8">
            <Stack direction="vertical" gap="md">
              <Heading level={2} className="text-2xl">
                Videos
              </Heading>
              <EmptyState icon="🎬" title="No videos available" />
            </Stack>
          </div>
        </Container>
      </Section>
    );
  }

  return (
    <Section id="youtube">
      <Container>
        <div className="glass rounded-2xl p-8">
          <Stack direction="vertical" gap="lg">
            <Heading level={2} className="text-2xl">
              Videos
            </Heading>

            {/* Videos Grid */}
            <div className="grid gap-6 md:grid-cols-2">
              {youtube.videos.map((video) => (
                <EmbedFrame key={video.id} src={video.embedUrl} title={`Video ${video.videoId}`} />
              ))}
            </div>
          </Stack>
        </div>
      </Container>
    </Section>
  );
}
