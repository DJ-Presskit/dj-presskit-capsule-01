import { Container, Section, Heading, Text, Stack } from "@/components/ui";

interface ReleasesProps {
  dict: any;
}

export function Releases({ dict }: ReleasesProps) {
  return (
    <Section id="releases">
      <Container>
        <div className="glass rounded-2xl p-8">
          <Stack direction="vertical" gap="md">
            <Heading level={2} className="text-2xl">
              {dict.nav.music}
            </Heading>
            <Text variant="muted">{dict.music.lastReleases}</Text>
            <div className="text-xs text-accent/60 font-mono mt-4 p-3 bg-accent/5 rounded-lg">
              💡 Skin: Render releases from <code>presskit.releases</code>
            </div>
          </Stack>
        </div>
      </Container>
    </Section>
  );
}
