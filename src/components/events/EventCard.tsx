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
 * - If TBA: show "TBA" prominently
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
  /** Whether this is a past event (changes layout) */
  isPast?: boolean;
  className?: string;
}

// =============================================================================
// Helpers
// =============================================================================

/**
 * Parse and format event date for upcoming events (big display)
 */
function parseEventDate(dateStr: string | null | undefined): {
  day: string;
  monthYear: string;
  isTBA: boolean;
} {
  if (!dateStr) {
    return { day: "", monthYear: "", isTBA: true };
  }

  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      return { day: "", monthYear: "", isTBA: true };
    }

    const day = date.getDate().toString().padStart(2, "0");
    const month = date.toLocaleDateString("es-ES", { month: "short" }).toUpperCase();
    const year = date.getFullYear();

    return {
      day,
      monthYear: `${month} ${year}`,
      isTBA: false,
    };
  } catch {
    return { day: "", monthYear: "", isTBA: true };
  }
}

/**
 * Format date for past events (simple inline format)
 */
function formatPastDate(dateStr: string | null | undefined): string {
  if (!dateStr) return "";

  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return "";

    return date.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "";
  }
}

// =============================================================================
// Past Event Card
// =============================================================================

function PastEventCard({ event, className }: { event: EventView; className?: string }) {
  const formattedDate = useMemo(() => formatPastDate(event.date), [event.date]);

  const location = useMemo(() => {
    const parts = [event.venue, event.city, event.country].filter(Boolean);
    return parts.join(", ");
  }, [event.venue, event.city, event.country]);

  return (
    <article
      className={cn(
        "flex flex-col md:flex-row md:items-center md:justify-between gap-2 md:gap-8 relative",
        "py-6 px-8  backdrop-blur-[10px]",
        className,
      )}
    >
      <AnimatedSeparator once direction="horizontal" className="absolute top-0" />
      <AnimatedSeparator once direction="horizontal" className="absolute bottom-0" />
      <AnimatedSeparator once direction="vertical" className="absolute left-0" />
      <AnimatedSeparator once direction="vertical" className="absolute right-0" />

      {/* Date */}
      {formattedDate && (
        <Text variant="content" className="text-foreground/50 text-sm shrink-0">
          {formattedDate}
        </Text>
      )}

      {/* Event Name */}
      <Text as="h3" variant="content" className="font-semibold flex-1">
        {event.title}
      </Text>

      {/* Location */}
      <Text variant="content" className="text-foreground/60 text-sm">
        {location}
      </Text>
    </article>
  );
}

// =============================================================================
// TBA Event Card (simplified - just big TBA centered)
// =============================================================================

function TBAEventCard({ className }: { className?: string }) {
  const { t } = useI18n();

  return (
    <article
      className={cn(
        "flex items-center justify-center p-10 backdrop-blur-[23px] bg-background/30 z-10 min-h-[150px] relative",
        className,
      )}
    >
      <AnimatedSeparator once direction="horizontal" className="absolute top-0" />
      <AnimatedSeparator once direction="horizontal" className="absolute bottom-0" />
      <AnimatedSeparator once direction="vertical" className="absolute left-0" />
      <AnimatedSeparator once direction="vertical" className="absolute right-0" />

      <Text variant="subtitle">{t("events.tba")}</Text>
    </article>
  );
}

// =============================================================================
// Upcoming Event Card (with full details)
// =============================================================================

function UpcomingEventCard({ event, className }: { event: EventView; className?: string }) {
  const { t } = useI18n();
  const dateInfo = useMemo(() => parseEventDate(event.date), [event.date]);

  const location = useMemo(() => {
    const parts = [event.city, event.country].filter(Boolean);
    return parts.join(", ");
  }, [event.city, event.country]);

  // Check if event is essentially TBA (missing critical data)
  const isTBA = dateInfo.isTBA || !event.title || !event.venue;

  // If TBA, show simplified card
  if (isTBA) {
    return <TBAEventCard className={className} />;
  }

  return (
    <article
      className={cn(
        "group grid gap-5 p-10 relative backdrop-blur-[23px] bg-background/30 z-10",
        // Mobile: single column
        "grid-cols-1",
        // Desktop: date | content | cta (only if has tickets)
        event.ticketsUrl
          ? "md:grid-cols-[100px_1fr_auto] md:items-center md:gap-8 xl:gap-15"
          : "md:grid-cols-[100px_1fr] md:items-center md:gap-8 xl:gap-15",
        className,
      )}
    >
      <AnimatedSeparator once direction="horizontal" className="absolute top-0" />
      <AnimatedSeparator once direction="horizontal" className="absolute bottom-0" />
      <AnimatedSeparator once direction="vertical" className="absolute left-0" />
      <AnimatedSeparator once direction="vertical" className="absolute right-0" />

      {/* Date Block */}
      <div className="flex flex-row md:flex-col items-baseline md:items-start gap-2 md:gap-0 relative">
        <div className="flex flex-col lg:items-center">
          <Text variant="customOutline" className="text-5xl lg:text-7xl 2xl:text-8xl">
            {dateInfo.day}
          </Text>
          <Text as="h6" variant="content" className="font-bold">
            {dateInfo.monthYear}
          </Text>
        </div>
      </div>

      {/* Content Block */}
      <div className="space-y-5">
        <Text
          as="h3"
          variant="subtitle"
          className="mix-blend-difference text-white 2xl:text-3xl line-clamp-1"
        >
          {event.title}
        </Text>
        <div className="space-y-0.5">
          <Text as="h6" variant="content" className="font-bold">
            {t("events.venue")}
          </Text>
          <Text variant="content">
            {event.venue}
            {location && `, ${location}`}
          </Text>
        </div>
      </div>

      {/* CTA Block - Only if has ticketsUrl */}
      {event.ticketsUrl && (
        <Link
          href={event.ticketsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 md:mt-0"
        >
          <Text variant="content" className="text-accent font-bold hover:underline">
            {t("events.buyTickets")}
          </Text>
        </Link>
      )}
    </article>
  );
}

// =============================================================================
// Main Component
// =============================================================================

export function EventCard({ event, isPast = false, className }: EventCardProps) {
  if (isPast) {
    return <PastEventCard event={event} className={className} />;
  }

  return <UpcomingEventCard event={event} className={className} />;
}

export default EventCard;
