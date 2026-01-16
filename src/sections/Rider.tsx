"use client";

/**
 * Technical Rider Section
 *
 * Displays DJ equipment setup in a responsive grid layout.
 * Features:
 * - Desktop: 3-column grid with AnimatedSeparator between rows
 * - Mobile: Single column with rounded bordered cards
 * - Conditional "MATERIAL PRENSA" button when driveUrl exists
 * - Smooth entrance animations
 */

import { useMemo } from "react";
import Link from "next/link";
import { usePresskit } from "@/context";
import { useI18n } from "@/core/i18n";
import { TechnicalRiderCard } from "@/components/rider";
import { AnimatedSeparator, Text } from "@/components/ui";
import { OutlineTitle } from "@/components/ui/OutlineTitle";

// =============================================================================
// Component
// =============================================================================

export function Rider() {
  const { presskit } = usePresskit();
  const { t } = useI18n();

  // Get rider items sorted by sortOrder
  const riderItems = useMemo(() => {
    const items = presskit.technicalRider?.items ?? [];
    return [...items].sort((a, b) => a.sortOrder - b.sortOrder);
  }, [presskit.technicalRider?.items]);

  const hasRider = riderItems.length > 0;
  const hasDriveUrl = Boolean(presskit.driveUrl);

  // Don't render if no rider items
  if (!hasRider) {
    return null;
  }

  // Calculate how many complete rows we have (for separator placement)
  const COLUMNS_DESKTOP = 3;
  const totalRows = Math.ceil(riderItems.length / COLUMNS_DESKTOP);

  return (
    <section id="rider" className="section-py relative">
      {/* Content Container */}
      <div className="container-content max-w-[1500px] min-[2500px]:max-w-[1800px] mx-auto section-px">
        {/* Section Header */}
        <div className="mb-10 lg:mb-16">
          <OutlineTitle title="rider.title" outlineTitle="Setup" />
        </div>

        {/* Equipment Grid */}
        <div className="space-y-6 md:space-y-0">
          {/* Desktop: 3-column grid with continuous vertical separators */}
          <div className="hidden md:block relative">
            {/* Vertical separators - span full height */}
            <AnimatedSeparator
              direction="vertical"
              className="absolute left-1/3 top-0 bottom-0 h-full -translate-x-1/2"
            />
            <AnimatedSeparator
              direction="vertical"
              className="absolute left-2/3 top-0 bottom-0 h-full -translate-x-1/2"
            />

            {/* Grid rows */}
            {Array.from({ length: totalRows }).map((_, rowIndex) => {
              const rowStart = rowIndex * COLUMNS_DESKTOP;
              const rowItems = riderItems.slice(rowStart, rowStart + COLUMNS_DESKTOP);

              return (
                <div key={rowIndex}>
                  {/* Row Grid */}
                  <div className="grid grid-cols-3">
                    {rowItems.map((item, itemIndex) => (
                      <TechnicalRiderCard key={item.id} item={item} index={rowStart + itemIndex} />
                    ))}
                    {/* Fill empty cells if row is incomplete */}
                    {rowItems.length < COLUMNS_DESKTOP &&
                      Array.from({ length: COLUMNS_DESKTOP - rowItems.length }).map((_, i) => (
                        <div key={`empty-${i}`} />
                      ))}
                  </div>
                  {/* Horizontal Row Separator (except after last row) */}
                  {rowIndex < totalRows - 1 && <AnimatedSeparator once className="my-6 lg:my-8" />}
                </div>
              );
            })}
          </div>

          {/* Mobile: Single column layout */}
          <div className="md:hidden space-y-5">
            {riderItems.map((item, index) => (
              <TechnicalRiderCard key={item.id} item={item} index={index} />
            ))}
          </div>
        </div>

        {/* CTA Button - Conditional on driveUrl */}
        {hasDriveUrl && (
          <div className="flex justify-center mt-10 lg:mt-16">
            <Link href={presskit.driveUrl!} target="_blank" rel="noopener noreferrer">
              <Text
                variant="content"
                className="text-accent font-bold underline uppercase hover:opacity-80 transition"
              >
                {t("rider.pressMaterial")}
              </Text>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

export default Rider;
