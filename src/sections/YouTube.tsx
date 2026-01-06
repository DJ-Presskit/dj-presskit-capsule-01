import { Container, Section, Heading, Text, Stack } from "@/components/ui";

interface YouTubeProps {
  dict: any;
}

export function YouTube({ dict }: YouTubeProps) {
  return (
    <Section id="youtube">
      <Container>
        <div className="glass rounded-2xl p-8">
          <Stack direction="vertical" gap="md">
            <Heading level={2} className="text-2xl">
              YouTube
            </Heading>
            <Text variant="muted">{dict.music.noReleases}</Text>
            <div className="text-xs text-accent/60 font-mono mt-4 p-3 bg-accent/5 rounded-lg">
              💡 Skin: Embed YouTube videos from <code>presskit.youtube</code>
            </div>
          </Stack>
        </div>
      </Container>
    </Section>
  );
}
