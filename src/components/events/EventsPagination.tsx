"use client";

/**
 * EventsPagination Component
 *
 * Simple numeric pagination for events list.
 * Shows page indicators (1, 2, 3...) with active state.
 */

import { cn } from "@/lib/cn";
import { Text } from "../ui";

// =============================================================================
// Types
// =============================================================================

interface EventsPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

// =============================================================================
// Component
// =============================================================================

export function EventsPagination({
  currentPage,
  totalPages,
  onPageChange,
  className,
}: EventsPaginationProps) {
  // Don't render if only 1 page
  if (totalPages <= 1) return null;

  return (
    <nav
      className={cn("flex items-center mx-auto lg:mx-0 gap-5", className)}
      aria-label="Events pagination"
    >
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          aria-current={currentPage === page ? "page" : undefined}
        >
          <Text
            as="h6"
            variant="content"
            className={cn(
              "font-bold text-lg",
              currentPage === page
                ? "text-accent underline"
                : "text-foreground/50 hover:text-foreground/80",
            )}
          >
            {page}
          </Text>
        </button>
      ))}
    </nav>
  );
}

export default EventsPagination;
