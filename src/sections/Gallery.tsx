import { Container, Section, Heading, Text, Stack } from "@/components/ui";

interface GalleryProps {
  dict: any;
}

export function Gallery({ dict }: GalleryProps) {
  return (
    <Section id="gallery">
      <Container>
        <div className="glass rounded-2xl p-8">
          <Stack direction="vertical" gap="md">
            <Heading level={2} className="text-2xl">
              {dict.gallery.title}
            </Heading>
            <Text variant="muted">{dict.gallery.noPhotos}</Text>
            <div className="text-xs text-accent/60 font-mono mt-4 p-3 bg-accent/5 rounded-lg">
              💡 Skin: Render gallery from <code>presskit.media.gallery</code>
            </div>
          </Stack>
        </div>
      </Container>
    </Section>
  );
}
