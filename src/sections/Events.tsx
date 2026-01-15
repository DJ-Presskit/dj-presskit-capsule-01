"use client";

/**
 * Events Section
 *
 * Displays past and upcoming events with pagination.
 * Features:
 * - Toggle between "Anteriores" (past) and "Próximos" (upcoming)
 * - Pagination with max 5 events per page (cohort)
 * - TBA support for events without confirmed date
 * - Smooth animations on tab/page changes
 * - Not rendered if no events exist
 */

import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePresskit } from "@/context";
import { useI18n } from "@/core/i18n";
import { BackgroundRenderer } from "@/core/background";
import { EventCard, EventsPagination } from "@/components/events";
import { AnimatedSeparator, Text } from "@/components/ui";
import { OutlineTitle } from "@/components/ui/OutlineTitle";
import { cn } from "@/lib/cn";

// =============================================================================
// Constants
// =============================================================================

const EVENTS_PER_PAGE = 5;

// =============================================================================
// Types
// =============================================================================

type EventTab = "upcoming" | "past";

// =============================================================================
// Component
// =============================================================================

export function Events() {
  const { theme, presskit } = usePresskit();
  const { t } = useI18n();

  // ---------------------------------------------------------------------------
  // State
  // ---------------------------------------------------------------------------

  const [activeTab, setActiveTab] = useState<EventTab>("upcoming");
  const [currentPage, setCurrentPage] = useState(1);

  // ---------------------------------------------------------------------------
  // Derived Data
  // ---------------------------------------------------------------------------

  // Sort upcoming events: nearest date first (ascending)
  const upcomingEvents = useMemo(() => {
    const events = presskit.events?.upcoming ?? [];
    return [...events].sort((a, b) => {
      const dateA = a.date ? new Date(a.date).getTime() : Infinity;
      const dateB = b.date ? new Date(b.date).getTime() : Infinity;
      return dateA - dateB; // Ascending: nearest first
    });
  }, [presskit.events?.upcoming]);

  // Sort past events: most recent first (descending)
  const pastEvents = useMemo(() => {
    const events = presskit.events?.past ?? [];
    return [...events]
      .filter((e) => {
        // Exclude TBA/Incomplete events from Past
        // Logic matches EventCard: if incomplete, it renders as TBA
        if (!e.date || !e.title || !e.venue) return false;
        // Check for valid date
        if (isNaN(new Date(e.date).getTime())) return false;
        return true;
      })
      .sort((a, b) => {
        const dateA = a.date ? new Date(a.date).getTime() : 0;
        const dateB = b.date ? new Date(b.date).getTime() : 0;
        return dateB - dateA; // Descending: most recent first
      });
  }, [presskit.events?.past]);

  const hasUpcoming = upcomingEvents.length > 0;
  const hasPast = pastEvents.length > 0;
  const hasEvents = hasUpcoming || hasPast;

  // Determine initial tab based on available events
  const effectiveTab = useMemo(() => {
    if (activeTab === "upcoming" && !hasUpcoming && hasPast) return "past";
    if (activeTab === "past" && !hasPast && hasUpcoming) return "upcoming";
    return activeTab;
  }, [activeTab, hasUpcoming, hasPast]);

  // Get events for current tab
  const currentEvents = effectiveTab === "upcoming" ? upcomingEvents : pastEvents;

  // Pagination
  const totalPages = Math.ceil(currentEvents.length / EVENTS_PER_PAGE);
  const paginatedEvents = useMemo(() => {
    const start = (currentPage - 1) * EVENTS_PER_PAGE;
    return currentEvents.slice(start, start + EVENTS_PER_PAGE);
  }, [currentEvents, currentPage]);

  // ---------------------------------------------------------------------------
  // Handlers
  // ---------------------------------------------------------------------------

  /**
   * Smooth scroll to events section
   */
  const scrollToEvents = useCallback(() => {
    const element = document.getElementById("events");
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  const handleTabChange = useCallback(
    (tab: EventTab) => {
      setActiveTab(tab);
      setCurrentPage(1);
      // Small delay to let state update, then scroll
      setTimeout(scrollToEvents, 100);
    },
    [scrollToEvents],
  );

  const handlePageChange = useCallback(
    (page: number) => {
      setCurrentPage(page);
      // Small delay to let state update, then scroll
      setTimeout(scrollToEvents, 100);
    },
    [scrollToEvents],
  );

  // ---------------------------------------------------------------------------
  // Early Return - No Events
  // ---------------------------------------------------------------------------

  if (!hasEvents) {
    return null;
  }

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <section id="events" className="relative section-py">
      {/* Multi-layer fade overlay for smooth transition */}
      <div
        className="absolute inset-x-0 top-0 h-[40%] pointer-events-none"
        style={{
          background: `linear-gradient(
            to top,
            transparent 0%,
            rgba(16, 16, 16, 0.05) 20%,
            rgba(16, 16, 16, 0.15) 35%,
            rgba(16, 16, 16, 0.35) 50%,
            rgba(16, 16, 16, 0.6) 65%,
            rgba(16, 16, 16, 0.85) 80%,
            rgb(16, 16, 16) 100%
          )`,
        }}
      />

      {/* Radial vignette for softer edges */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(
            ellipse 120% 100% at 50% 0%,
            transparent 40%,
            rgba(16, 16, 16, 0.3) 70%,
            rgba(16, 16, 16, 0.6) 90%,
            rgb(16, 16, 16) 100%
          )`,
        }}
      />

      {/* Background */}
      <BackgroundRenderer theme={theme} />

      {/* Content Container */}
      <div className="container-content relative z-10 max-w-[1500px] mx-auto  section-px min-[2500px]:max-w-[1800px] lg:pt-[15%]">
        {/* Header with Title and Tabs */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
          {/* Section Title */}
          <div>
            <OutlineTitle title="events.default" outlineTitle="nav.events" />
          </div>

          {/* Tab Navigation - Only show if both types exist */}
          {hasUpcoming && hasPast && (
            <nav className="flex items-center lg:hidden gap-5 mx-auto" aria-label="Event filters">
              <button
                onClick={() => handleTabChange("past")}
                aria-pressed={effectiveTab === "past"}
              >
                <Text
                  variant="content"
                  className={cn(
                    "transition-colors uppercase font-medium",
                    effectiveTab === "past"
                      ? "text-accent underline"
                      : "text-foreground/50 hover:text-foreground/80",
                  )}
                >
                  {t("events.past")}
                </Text>
              </button>
              <button
                onClick={() => handleTabChange("upcoming")}
                aria-pressed={effectiveTab === "upcoming"}
              >
                <Text
                  variant="content"
                  className={cn(
                    "transition-colors uppercase font-medium",
                    effectiveTab === "upcoming"
                      ? "text-accent underline"
                      : "text-foreground/50 hover:text-foreground/80",
                  )}
                >
                  {t("events.next")}
                </Text>
              </button>
            </nav>
          )}
        </div>

        <div className="items-center justify-between mt-10 hidden md:flex">
          {/* Pagination */}
          <EventsPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />

          {/* Tab Navigation (Bottom - Desktop Only) */}
          {hasUpcoming && hasPast && (
            <nav className="hidden lg:flex items-center gap-5" aria-label="Event filters">
              <button
                onClick={() => handleTabChange("past")}
                aria-pressed={effectiveTab === "past"}
              >
                <Text
                  variant="content"
                  className={cn(
                    "transition-colors uppercase font-medium",
                    effectiveTab === "past"
                      ? "text-accent underline"
                      : "text-foreground/50 hover:text-foreground/80",
                  )}
                >
                  {t("events.past")}
                </Text>
              </button>
              <button
                onClick={() => handleTabChange("upcoming")}
                aria-pressed={effectiveTab === "upcoming"}
              >
                <Text
                  variant="content"
                  className={cn(
                    "transition-colors uppercase font-medium",
                    effectiveTab === "upcoming"
                      ? "text-accent underline"
                      : "text-foreground/50 hover:text-foreground/80",
                  )}
                >
                  {t("events.next")}
                </Text>
              </button>
            </nav>
          )}
        </div>

        {/* Events List with animations */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${effectiveTab}-${currentPage}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="space-y-5 md:space-y-0"
          >
            {paginatedEvents.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: index * 0.05 }}
              >
                <EventCard event={event} />
                <AnimatedSeparator once className="hidden md:block" />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Footer with Pagination and Tabs (Desktop) */}
        <div className="flex items-center justify-between mt-10">
          {/* Pagination */}
          <EventsPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />

          {/* Tab Navigation (Bottom - Desktop Only) */}
          {hasUpcoming && hasPast && (
            <nav className="hidden lg:flex items-center gap-5" aria-label="Event filters">
              <button
                onClick={() => handleTabChange("past")}
                aria-pressed={effectiveTab === "past"}
              >
                <Text
                  variant="content"
                  className={cn(
                    "transition-colors uppercase font-medium",
                    effectiveTab === "past"
                      ? "text-accent underline"
                      : "text-foreground/50 hover:text-foreground/80",
                  )}
                >
                  {t("events.past")}
                </Text>
              </button>
              <button
                onClick={() => handleTabChange("upcoming")}
                aria-pressed={effectiveTab === "upcoming"}
              >
                <Text
                  variant="content"
                  className={cn(
                    "transition-colors uppercase font-medium",
                    effectiveTab === "upcoming"
                      ? "text-accent underline"
                      : "text-foreground/50 hover:text-foreground/80",
                  )}
                >
                  {t("events.next")}
                </Text>
              </button>
            </nav>
          )}
        </div>
      </div>
    </section>
  );
}

export default Events;
