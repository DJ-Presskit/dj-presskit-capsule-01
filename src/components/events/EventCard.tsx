"use client";

/**
 * EventCard Component
 *
 * Different layouts for past vs upcoming events:
 *
 * PAST EVENTS:
 * - Only show: formatted date, event name, venue/location
 * - No big date block, no buy tickets
 *
 * UPCOMING EVENTS:
 * - If TBA: show "TBA" as date, but still show all available info (title, venue, location)
 * - If has date: show big date block (day + month/year)
 * - If has ticketsUrl: show buy tickets link
 */

import { useMemo } from "react";
import { cn } from "@/lib/cn";
import { useI18n } from "@/core/i18n";
import type { EventView } from "@/types";
import { AnimatedSeparator, Text } from "../ui";
import Link from "next/link";

// =============================================================================
// Types
// =============================================================================

interface EventCardProps {
  event: EventView;
  className?: string;
}

// =============================================================================
// Helpers
// =============================================================================

/**
 * Parse formatted date from API (e.g., "22 ENE 2026") into day and month/year
 * API is the source of truth - dates come pre-formatted from presskit builder
 */
function parseFormattedDate(formattedDate: string | null): {
  day: string;
  monthYear: string;
} {
  if (!formattedDate) {
    return { day: "", monthYear: "" };
  }

  // API sends dates as "DD MMM YYYY" (e.g., "22 ENE 2026", "05 FEB 2026")
  const parts = formattedDate.trim().split(" ");

  if (parts.length === 3) {
    return {
      day: parts[0], // "22"
      monthYear: `${parts[1]} ${parts[2]}`, // "ENE 2026"
    };
  }

  // Fallback if format is unexpected - return whole string as day
  return { day: formattedDate, monthYear: "" };
}

// =============================================================================
// Component
// =============================================================================

export function EventCard({ event, className }: EventCardProps) {
  const { t } = useI18n();

  // Use API isTba flag - API is the source of truth
  const isTba = event.isTba ?? false;

  // Parse the pre-formatted date from API (e.g., "22 ENE 2026")
  const dateInfo = useMemo(() => parseFormattedDate(event.date), [event.date]);

  // Build location string from available parts
  const location = useMemo(() => {
    const parts = [event.city, event.country].filter((p): p is string => Boolean(p) && p !== null);
    return parts.join(", ");
  }, [event.city, event.country]);

  // Check if we have venue info to show
  const hasVenue = Boolean(event.venue);
  const hasLocation = Boolean(location);

  return (
    <article
      className={cn(
        "group grid gap-5 p-10 relative backdrop-blur-[23px] bg-background/30 md:bg-transparent md:border-0 md:rounded-none md:backdrop-blur-none z-10 md:py-0 md:min-h-[220px]",
        // Mobile: single column
        "grid-cols-1 rounded-xl border border-white/20",
        "md:grid-cols-[160px_1fr_auto] md:items-center md:gap-8 xl:gap-15",
        className,
      )}
    >
      {/* Date Block */}
      <div className="flex flex-row md:flex-col items-baseline md:items-start md:justify-center gap-2 md:gap-0 relative h-full w-full">
        <div className="flex flex-col lg:items-center">
          {isTba ? (
            // TBA: Show "TBA" prominently
            <Text variant="customOutline" className="text-5xl">
              {t("events.tba")}
            </Text>
          ) : (
            // Has date: Show day and month/year
            <>
              <Text variant="customOutline" className="text-5xl lg:text-7xl 2xl:text-8xl">
                {dateInfo.day}
              </Text>
              <Text as="h6" variant="content" className="font-bold">
                {dateInfo.monthYear}
              </Text>
            </>
          )}
        </div>
        <AnimatedSeparator once direction="vertical" className="hidden absolute right-0 md:block" />
      </div>

      {/* Content Block */}
      <div className="space-y-5">
        {/* Title - always shown */}
        <Text
          as="h3"
          variant="subtitle"
          className="mix-blend-difference text-white 2xl:text-3xl lg:line-clamp-1"
        >
          {event.title}
        </Text>

        {/* Venue & Location - show if any info available */}
        {(hasVenue || hasLocation) && (
          <div className="space-y-0.5">
            <Text as="h6" variant="content" className="font-bold">
              {t("events.venue")}
            </Text>
            <Text variant="content">
              {hasVenue && event.venue}
              {hasVenue && hasLocation && ", "}
              {hasLocation && location}
            </Text>
          </div>
        )}
      </div>

      {/* CTA Block - Only if has ticketsUrl */}
      {event.ticketsUrl && (
        <Link
          href={event.ticketsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 md:mt-0"
        >
          <Text
            variant="content"
            className="text-accent underline font-bold hover:opacity-80 transition"
          >
            {t("events.buyTickets")}
          </Text>
        </Link>
      )}
    </article>
  );
}

export default EventCard;
