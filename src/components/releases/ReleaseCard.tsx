"use client";

/**
 * ReleaseCard Component
 *
 * Displays a single release with:
 * - Play icon (accent color) - clickable if has URL
 * - Title
 * - Label (record label)
 * - Date (formatted or TBA)
 *
 * Supports flexible data: date can be null (TBA), URL can be undefined.
 */

import Link from "next/link";
import { Play } from "lucide-react";
import { cn } from "@/lib/cn";
import { useI18n } from "@/core/i18n";
import type { ReleaseView } from "@/types";
import { Text } from "@/components/ui";

// =============================================================================
// Types
// =============================================================================

interface ReleaseCardProps {
  release: ReleaseView;
  className?: string;
}

// =============================================================================
// Component
// =============================================================================

export function ReleaseCard({ release, className }: ReleaseCardProps) {
  const { t } = useI18n();

  // Determine if TBA: use API flag or fallback to null date check
  const isTba = release.isTba ?? !release.releaseDate;

  const hasUrl = Boolean(release.url);

  // Card content
  const cardContent = (
    <article
      className={cn(
        "group p-6 md:p-8 lg:p-10 bg-background-lighter rounded-xl border border-background-lighter transition",
        "min-h-[160px] md:min-h-[180px]", // Consistent height across all cards
        hasUrl && "hover:border-accent/50 cursor-pointer",
        className,
      )}
    >
      <div className="flex justify-between items-center h-full gap-4">
        {/* Left side: Title, Label, Date */}
        <div className="flex flex-col gap-4 flex-1 min-w-0">
          {/* Title + Label */}
          <div className="space-y-1">
            <Text
              as="h3"
              variant="subtitle"
              className="line-clamp-2 text-xl md:text-2xl xl:text-3xl 2xl:text-3xl leading-tight"
            >
              {release.title}
            </Text>
            {release.label && (
              <Text variant="content" className="text-foreground/70 line-clamp-1">
                {release.label}
              </Text>
            )}
          </div>

          {/* Date row */}
          <div className="flex flex-col gap-2">
            <Text variant="content" className="font-semibold text-foreground/80">
              {t("music.date")}:
            </Text>
            <Text
              variant="content"
              className={cn(isTba && "text-accent font-medium", !isTba && "text-foreground/70")}
            >
              {isTba ? t("music.tba") : release.releaseDate}
            </Text>
          </div>
        </div>

        {/* Right side: Play button */}
        <div
          className={cn(
            "shrink-0 rounded-full bg-accent p-3 md:p-4 w-12 h-12 md:w-14 md:h-14 flex items-center justify-center",
            hasUrl && "group-hover:scale-105 transition-transform",
            !hasUrl && "opacity-50",
          )}
        >
          <Play className="fill-background-lighter text-background-lighter w-5 h-5 md:w-6 md:h-6" />
        </div>
      </div>
    </article>
  );

  // Wrap with Link if has URL
  if (hasUrl && release.url) {
    return (
      <Link href={release.url} target="_blank" rel="noopener noreferrer" className="block h-full">
        {cardContent}
      </Link>
    );
  }

  return cardContent;
}

export default ReleaseCard;
