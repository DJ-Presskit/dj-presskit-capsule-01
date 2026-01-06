import { Container, Section, Heading, Text, Stack } from "@/components/ui";

interface EventsProps {
  dict: any;
}

export function Events({ dict }: EventsProps) {
  return (
    <Section id="events">
      <Container>
        <div className="glass rounded-2xl p-8">
          <Stack direction="vertical" gap="md">
            <Heading level={2} className="text-2xl">
              {dict.events.default}
            </Heading>
            <Text variant="muted">{dict.events.noEvents}</Text>
            <div className="text-xs text-accent/60 font-mono mt-4 p-3 bg-accent/5 rounded-lg">
              💡 Skin: Render events from <code>presskit.events.upcoming</code>{" "}
              and <code>presskit.events.past</code>
            </div>
          </Stack>
        </div>
      </Container>
    </Section>
  );
}
