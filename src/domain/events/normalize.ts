/**
 * Events Section Normalizer
 */

import type { EventsVM, EventVM } from "../types";
import {
  trimString,
  safeUrl,
  parseDate,
  formatDate,
  isPastDate,
  sortByDate,
  dedupeById,
} from "../validators";

interface EventDTO {
  id?: string;
  title?: string;
  date?: string;
  venue?: string;
  city?: string;
  country?: string;
  ticketsUrl?: string;
  isFeatured?: boolean;
  eventType?: string;
}

interface EventsDTO {
  events?: {
    upcoming?: EventDTO[];
    past?: EventDTO[];
  };
}

function normalizeEvent(dto: EventDTO, index: number): EventVM | null {
  const title = trimString(dto.title);
  if (!title) return null; // Title is required

  const date = parseDate(dto.date);
  const isPast = isPastDate(date);

  return {
    id: dto.id || `event-${index}`,
    title,
    date,
    dateFormatted: formatDate(date),
    venue: trimString(dto.venue) || "",
    city: trimString(dto.city) || "",
    country: trimString(dto.country) || "",
    ticketsUrl: safeUrl(dto.ticketsUrl),
    isFeatured: Boolean(dto.isFeatured),
    eventType: trimString(dto.eventType),
    isPast,
  };
}

export function normalizeEvents(dto: EventsDTO | null | undefined): EventsVM {
  const eventsData = dto?.events;

  // Normalize upcoming events
  const upcomingRaw = Array.isArray(eventsData?.upcoming) ? eventsData.upcoming : [];
  const upcoming = upcomingRaw
    .map((e, i) => normalizeEvent(e, i))
    .filter((e): e is EventVM => e !== null);

  // Normalize past events
  const pastRaw = Array.isArray(eventsData?.past) ? eventsData.past : [];
  const past = pastRaw
    .map((e, i) => normalizeEvent(e, i + 1000)) // Offset index for unique IDs
    .filter((e): e is EventVM => e !== null);

  // Dedupe and sort
  const uniqueUpcoming = dedupeById(upcoming);
  const uniquePast = dedupeById(past);

  // Sort upcoming by date ascending (nearest first)
  const sortedUpcoming = sortByDate(uniqueUpcoming, (e) => e.date, "asc");
  // Sort past by date descending (most recent first)
  const sortedPast = sortByDate(uniquePast, (e) => e.date, "desc");

  return {
    upcoming: sortedUpcoming,
    past: sortedPast,
    hasUpcoming: sortedUpcoming.length > 0,
    hasPast: sortedPast.length > 0,
    hasEvents: sortedUpcoming.length > 0 || sortedPast.length > 0,
  };
}
