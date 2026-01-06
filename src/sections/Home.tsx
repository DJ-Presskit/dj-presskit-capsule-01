import { Container, Section, Stack, PresskitLogo } from "@/components/ui";

interface HomeProps {
  presskit: any;
}

export function Home({ presskit }: HomeProps) {
  const media = presskit.media as any;
  const logo = media?.logo;

  return (
    <Section
      id="home"
      className="flex items-center justify-center min-h-[80vh] text-center"
    >
      <Container>
        <Stack direction="vertical" gap="xl" align="center">
          <PresskitLogo
            logo={logo}
            artistName={presskit.artistName}
            size="lg"
          />
        </Stack>
      </Container>
    </Section>
  );
}
