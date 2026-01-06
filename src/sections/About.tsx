import { Container, Section, Stack, Text, Badge } from "@/components/ui";

interface AboutProps {
  presskit: any;
}

export function About({ presskit }: AboutProps) {
  const profile = presskit.profile || {};
  return (
    <Section id="about">
      <Container>
        <Stack direction="vertical" gap="xl" align="center">
          {/* Genres */}
          {profile.genres && profile.genres.length > 0 && (
            <Stack
              direction="horizontal"
              gap="sm"
              className="flex-wrap justify-center"
            >
              {profile.genres.slice(0, 5).map((genre: string) => (
                <Badge key={genre} variant="accent">
                  {genre}
                </Badge>
              ))}
            </Stack>
          )}

          {/* Short Bio */}
          {profile.shortBio && (
            <Text
              variant="lead"
              className="max-w-2xl text-lg md:text-xl opacity-90"
            >
              {profile.shortBio.length > 250
                ? `${profile.shortBio.slice(0, 250)}...`
                : profile.shortBio}
            </Text>
          )}

          {/* Location */}
          {profile.location && (
            <Text variant="muted" className="flex items-center gap-2 text-sm">
              <span className="text-accent">📍</span> {profile.location}
            </Text>
          )}
        </Stack>
      </Container>
    </Section>
  );
}
