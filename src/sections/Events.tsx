"use client";

/**
 * Events Section - Data-driven events with tabs
 */

import { useState } from "react";
import { Container, Section, Heading, Stack, Text } from "@/components/ui";
import type { EventsVM } from "../domain/types";
import { EventCard } from "../components/EventCard";
import { EmptyState } from "../components/EmptyState";

interface EventsProps {
  events: EventsVM;
  dict?: {
    events?: { default?: string; next?: string; past?: string; noEvents?: string };
  };
}

type TabKey = "upcoming" | "past";

export function Events({ events, dict }: EventsProps) {
  const [activeTab, setActiveTab] = useState<TabKey>(events.hasUpcoming ? "upcoming" : "past");

  // Empty state (no events at all)
  if (!events.hasEvents) {
    return (
      <Section id="events">
        <Container>
          <div className="glass rounded-2xl p-8">
            <Stack direction="vertical" gap="md">
              <Heading level={2} className="text-2xl">
                {dict?.events?.default || "Events"}
              </Heading>
              <EmptyState icon="📅" title={dict?.events?.noEvents || "No events scheduled"} />
            </Stack>
          </div>
        </Container>
      </Section>
    );
  }

  const tabs: { key: TabKey; label: string; count: number }[] = [
    { key: "upcoming", label: dict?.events?.next || "Upcoming", count: events.upcoming.length },
    { key: "past", label: dict?.events?.past || "Past", count: events.past.length },
  ];

  const currentEvents = activeTab === "upcoming" ? events.upcoming : events.past;

  return (
    <Section id="events">
      <Container>
        <div className="glass rounded-2xl p-8">
          <Stack direction="vertical" gap="lg">
            <Heading level={2} className="text-2xl">
              {dict?.events?.default || "Events"}
            </Heading>

            {/* Tab Navigation */}
            <div className="flex gap-2">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  disabled={tab.count === 0}
                  className={`
                    px-4 py-2 rounded-lg text-sm font-medium transition-all
                    ${
                      activeTab === tab.key
                        ? "bg-accent text-background"
                        : "bg-white/5 hover:bg-white/10 text-foreground"
                    }
                    ${tab.count === 0 ? "opacity-50 cursor-not-allowed" : ""}
                  `}
                >
                  {tab.label}
                  <span className="ml-2 text-xs opacity-70">({tab.count})</span>
                </button>
              ))}
            </div>

            {/* Events Grid */}
            {currentEvents.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2">
                {currentEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            ) : (
              <Text variant="muted" className="text-center py-8">
                No {activeTab} events
              </Text>
            )}
          </Stack>
        </div>
      </Container>
    </Section>
  );
}
