import { Container, Stack, Text, DJPresskitBanner } from "@/components/ui";

interface FooterProps {
  presskit: any;
  dict: any;
  lang: string;
}

export function Footer({ presskit, dict, lang }: FooterProps) {
  return (
    <footer className="border-t border-white/5">
      <Container>
        <Stack direction="vertical" gap="sm" align="center" className="py-8">
          <Text variant="caption" className="opacity-60">
            © {new Date().getFullYear()} {presskit.artistName}.{" "}
            {dict.footer.allRightsReserved}.
          </Text>
        </Stack>
      </Container>
      <DJPresskitBanner locale={lang as "es" | "en"} showDecorative={false} />
    </footer>
  );
}
