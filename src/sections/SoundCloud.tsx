import { Container, Section, Heading, Text, Stack } from "@/components/ui";

interface SoundCloudProps {
  dict: any;
}

export function SoundCloud({ dict }: SoundCloudProps) {
  return (
    <Section id="soundcloud">
      <Container>
        <div className="glass rounded-2xl p-8">
          <Stack direction="vertical" gap="md">
            <Heading level={2} className="text-2xl">
              SoundCloud
            </Heading>
            <Text variant="muted">{dict.music.noReleases}</Text>
            <div className="text-xs text-accent/60 font-mono mt-4 p-3 bg-accent/5 rounded-lg">
              💡 Skin: Embed SoundCloud player from{" "}
              <code>presskit.soundcloud</code>
            </div>
          </Stack>
        </div>
      </Container>
    </Section>
  );
}
