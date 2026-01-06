import { Container, Section, Heading, Text, Stack } from "@/components/ui";

interface RiderProps {
  dict: any;
}

export function Rider({ dict }: RiderProps) {
  return (
    <Section id="technical-rider">
      <Container>
        <div className="glass rounded-2xl p-8">
          <Stack direction="vertical" gap="md">
            <Heading level={2} className="text-2xl">
              {dict.rider.title}
            </Heading>
            <Text variant="muted">{dict.rider.noRider}</Text>
            <div className="text-xs text-accent/60 font-mono mt-4 p-3 bg-accent/5 rounded-lg">
              💡 Skin: Render rider from <code>presskit.rider</code>
            </div>
          </Stack>
        </div>
      </Container>
    </Section>
  );
}
