/**
 * EventCard - Display for a single event
 */

import type { EventVM } from "../domain/types";
import { ExternalLink } from "./ExternalLink";

interface EventCardProps {
  event: EventVM;
  dict?: {
    tickets?: string;
    featured?: string;
  };
}

export function EventCard({ event, dict }: EventCardProps) {
  const { title, dateFormatted, venue, city, country, ticketsUrl, isFeatured, eventType, isPast } =
    event;

  return (
    <div
      className={`glass rounded-xl p-5 transition-all hover:bg-white/5 ${
        isPast ? "opacity-70" : ""
      }`}
    >
      <div className="flex flex-col gap-3">
        {/* Header: Date & Featured Badge */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col">
            <span className="text-xs uppercase tracking-wider text-accent font-medium">
              {dateFormatted || "TBA"}
            </span>
            {eventType && <span className="text-xs text-muted-foreground mt-1">{eventType}</span>}
          </div>

          {isFeatured && (
            <span className="px-2 py-0.5 text-xs bg-accent/20 text-accent rounded-full">
              {dict?.featured || "⭐"}
            </span>
          )}

          {isPast && (
            <span className="px-2 py-0.5 text-xs bg-muted text-muted-foreground rounded-full">
              Past
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold leading-tight">{title}</h3>

        {/* Location */}
        {(venue || city || country) && (
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            <span className="text-accent">📍</span>
            {[venue, city, country].filter(Boolean).join(" · ")}
          </p>
        )}

        {/* Tickets CTA */}
        {ticketsUrl && !isPast && (
          <div className="pt-2">
            <ExternalLink
              href={ticketsUrl}
              className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 hover:bg-accent/20 rounded-lg text-sm font-medium text-accent"
            >
              {dict?.tickets || "Get Tickets"}
            </ExternalLink>
          </div>
        )}
      </div>
    </div>
  );
}
