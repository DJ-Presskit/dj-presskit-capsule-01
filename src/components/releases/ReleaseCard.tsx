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

import { useMemo } from "react";
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
// Helpers
// =============================================================================

/**
 * Format release date for display
 */
function formatReleaseDate(dateStr: string | null): {
  formatted: string;
  isTBA: boolean;
} {
  if (!dateStr) {
    return { formatted: "", isTBA: true };
  }

  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      return { formatted: "", isTBA: true };
    }

    const formatted = date.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "numeric",
      year: "numeric",
    });

    return { formatted, isTBA: false };
  } catch {
    return { formatted: "", isTBA: true };
  }
}

// =============================================================================
// Component
// =============================================================================

export function ReleaseCard({ release, className }: ReleaseCardProps) {
  const { t } = useI18n();

  const dateInfo = useMemo(() => formatReleaseDate(release.releaseDate), [release.releaseDate]);

  const hasUrl = Boolean(release.url);

  // Card content
  const cardContent = (
    <article
      className={cn(
        "group p-10 bg-background-lighter rounded-xl border border-background-lighter transition",
        hasUrl && "hover:border-accent/50 cursor-pointer",
        className,
      )}
    >
      <div className="flex justify-between items-center">
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-1">
            <Text as="h3" variant="subtitle" className="line-clamp-1 xl:text-3xl 2xl:text-3xl">
              {release.title}
            </Text>
            {release.label && <Text variant="content">{release.label}</Text>}
          </div>

          <div className="flex flex-col gap-1">
            <Text variant="content" className="font-bold">
              {t("music.date")}
            </Text>
            <Text variant="content">{dateInfo.isTBA ? t("music.tba") : dateInfo.formatted}</Text>
          </div>
        </div>

        <div
          className={cn(
            "rounded-full bg-accent p-4 w-15 h-15 flex items-center justify-center hover:opacity-80 transition",
          )}
        >
          <Play className="fill-background-lighter text-background-lighter group-hover:scale-120 transition" />
        </div>
      </div>
    </article>
  );

  // Wrap with Link if has URL
  if (hasUrl && release.url) {
    return (
      <Link href={release.url} target="_blank" rel="noopener noreferrer" className="block">
        {cardContent}
      </Link>
    );
  }

  return cardContent;
}

export default ReleaseCard;
