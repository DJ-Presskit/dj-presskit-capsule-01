"use client";

/**
 * TechnicalRiderCard Component
 *
 * Displays individual DJ equipment item with:
 * - Equipment image (centered)
 * - Custom title (accent color, e.g., "PLAYER 1", "MIXER")
 * - Model name (muted text)
 *
 * Responsive styling:
 * - Mobile: rounded borders with backdrop blur
 * - Desktop: minimal (separators at section level)
 */

import { ImageOff } from "lucide-react";
import { OptimizedImage } from "@/components/media";
import { Text } from "@/components/ui";
import { cn } from "@/lib/cn";
import type { TechnicalRiderItemView } from "@/types";

// =============================================================================
// Types
// =============================================================================

interface TechnicalRiderCardProps {
  item: TechnicalRiderItemView;
  index: number;
  className?: string;
}

// =============================================================================
// Component
// =============================================================================

export function TechnicalRiderCard({ item, index, className }: TechnicalRiderCardProps) {
  return (
    <article
      className={cn(
        "flex flex-col items-start gap-4 p-6",
        // Mobile: bordered card with backdrop blur
        "rounded-xl border border-white/20 backdrop-blur-[23px] bg-background/30",
        // Desktop: remove borders (separators handled at section level)
        "md:rounded-none md:border-0 md:backdrop-blur-none md:bg-transparent md:p-6 lg:p-10 xl:p-12",
        className,
      )}
    >
      {/* Equipment Image */}
      <div className="relative w-full aspect-4/3 flex items-center justify-center p-4">
        {item.imageUrl ? (
          <OptimizedImage
            src={item.imageUrl}
            alt={item.title}
            fill
            className="object-contain"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <div className="flex flex-col items-center justify-center gap-2">
            <ImageOff className="w-12 h-12 lg:w-16 lg:h-16" />
            <Text variant="content" className="text-xs text-foreground/30">
              Sin imagen
            </Text>
          </div>
        )}
      </div>

      {/* Equipment Info */}
      <div className="space-y-1">
        {/* Custom Title (e.g., "PLAYER 1", "MIXER") */}
        <Text as="h4" variant="content" className="text-accent font-extrabold">
          {item.customTitle ?? <br />}
        </Text>

        {/* Model Name */}
        <Text variant="content" className="text-foreground/50">
          {item.title}
        </Text>

        {/* Optional Note */}
        {item.note && (
          <Text variant="content" className="text-foreground/50 text-xs italic">
            {item.note}
          </Text>
        )}
      </div>
    </article>
  );
}

export default TechnicalRiderCard;
