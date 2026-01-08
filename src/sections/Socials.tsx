/**
 * Socials Section - Social links display
 */

import { Container, Section, Heading, Stack } from "@/components/ui";
import type { SocialsVM } from "../domain/types";
import { SocialIcon } from "../components/SocialIcon";
import { EmptyState } from "../components/EmptyState";

interface SocialsProps {
  socials: SocialsVM;
  dict?: {
    contact?: { title?: string; bookingLabel?: string };
  };
}

export function Socials({ socials, dict }: SocialsProps) {
  const hasAnyContent = socials.hasLinks || socials.hasContact;

  // Empty state
  if (!hasAnyContent) {
    return (
      <Section id="socials">
        <Container>
          <div className="glass rounded-2xl p-8">
            <Stack direction="vertical" gap="md">
              <Heading level={2} className="text-2xl">
                {dict?.contact?.title || "Connect"}
              </Heading>
              <EmptyState icon="🔗" title="No social links available" />
            </Stack>
          </div>
        </Container>
      </Section>
    );
  }

  return (
    <Section id="socials">
      <Container>
        <div className="glass rounded-2xl p-8">
          <Stack direction="vertical" gap="lg" align="center">
            <Heading level={2} className="text-2xl">
              {dict?.contact?.title || "Connect"}
            </Heading>

            {/* Social Icons */}
            {socials.hasLinks && (
              <div className="flex flex-wrap justify-center gap-4">
                {socials.links.map((link) => (
                  <SocialIcon
                    key={link.id}
                    platform={link.platform}
                    url={link.url}
                    iconUrl={link.iconUrl}
                  />
                ))}
              </div>
            )}

            {/* Contact CTAs */}
            {socials.hasContact && (
              <div className="flex flex-wrap justify-center gap-4 mt-4">
                {socials.primaryEmail && (
                  <a
                    href={`mailto:${socials.primaryEmail}`}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-background rounded-xl font-medium hover:opacity-90 transition-opacity"
                  >
                    <span>✉️</span>
                    Email
                  </a>
                )}
                {socials.primaryWhatsapp && (
                  <a
                    href={`https://wa.me/${socials.primaryWhatsapp.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl font-medium hover:opacity-90 transition-opacity"
                  >
                    <span>📱</span>
                    WhatsApp
                  </a>
                )}
              </div>
            )}
          </Stack>
        </div>
      </Container>
    </Section>
  );
}
