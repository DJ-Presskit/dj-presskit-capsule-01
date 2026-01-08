/**
 * Footer - Minimal footer component
 */

import { Container } from "@/components/ui";
import { ExternalLink } from "../components/ExternalLink";

interface FooterProps {
  artistName?: string;
  driveUrl?: string | null;
  dict?: {
    common?: { pressMaterial?: string };
    footer?: { copyright?: string };
  };
}

export function Footer({ artistName, driveUrl, dict }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-8 mt-8">
      <Container>
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          {/* Left: Artist name + download */}
          <div className="flex items-center gap-4">
            {artistName && (
              <span>
                © {currentYear} {artistName}
              </span>
            )}
            {driveUrl && (
              <ExternalLink href={driveUrl} className="text-accent">
                {dict?.common?.pressMaterial || "Download Press Kit"}
              </ExternalLink>
            )}
          </div>

          {/* Right: Powered by */}
          <div className="flex items-center gap-2">
            <span className="opacity-60">Powered by</span>
            <a
              href="https://dj-presskit.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-accent hover:underline"
            >
              DJ Presskit
            </a>
          </div>
        </div>
      </Container>
    </footer>
  );
}
