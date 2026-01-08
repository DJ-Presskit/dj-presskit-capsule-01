/**
 * Gallery Section - Data-driven image gallery
 */

import { Container, Section, Heading, Stack } from "@/components/ui";
import type { GalleryVM } from "../domain/types";
import { EmptyState } from "../components/EmptyState";

interface GalleryProps {
  gallery: GalleryVM;
  dict?: {
    gallery?: { title?: string; photos?: string; noPhotos?: string };
  };
}

export function Gallery({ gallery, dict }: GalleryProps) {
  // Empty state
  if (!gallery.hasImages) {
    return (
      <Section id="gallery">
        <Container>
          <div className="glass rounded-2xl p-8">
            <Stack direction="vertical" gap="md">
              <Heading level={2} className="text-2xl">
                {dict?.gallery?.title || "Gallery"}
              </Heading>
              <EmptyState title={dict?.gallery?.noPhotos || "No images available"} />
            </Stack>
          </div>
        </Container>
      </Section>
    );
  }

  return (
    <Section id="gallery">
      <Container>
        <div className="glass rounded-2xl p-8">
          <Stack direction="vertical" gap="lg">
            <Heading level={2} className="text-2xl">
              {dict?.gallery?.title || "Gallery"}
            </Heading>

            {/* Image Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {gallery.images.map((image) => (
                <div
                  key={image.id}
                  className="aspect-square rounded-xl overflow-hidden bg-black/20 transition-transform hover:scale-[1.02]"
                >
                  <img
                    src={image.url}
                    alt={image.alt}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>

            {/* Count */}
            <p className="text-sm text-muted-foreground text-center">
              {gallery.totalCount} {gallery.totalCount === 1 ? "image" : "images"}
            </p>
          </Stack>
        </div>
      </Container>
    </Section>
  );
}
