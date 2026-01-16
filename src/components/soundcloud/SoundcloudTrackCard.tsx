"use client";

/**
 * SoundcloudTrackCard Component
 *
 * Individual track card with accordion expand effect.
 * Features:
 * - Background artwork with cover fit
 * - Dark gradient overlay for text readability
 * - Title and duration display with letter-by-letter animation
 * - Global link to SoundCloud track
 * - Smooth expand/collapse animation
 */

import React, { useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { OptimizedImage } from "@/components/media";
import { Text } from "@/components/ui";
import { cn } from "@/lib/cn";
import type { SoundcloudTrackView } from "@/types";

// =============================================================================
// Types
// =============================================================================

interface SoundcloudTrackCardProps {
  track: SoundcloudTrackView;
  isExpanded: boolean;
  onExpand: () => void;
  className?: string;
}

// =============================================================================
// Helpers
// =============================================================================

/**
 * Format duration from milliseconds to mm:ss
 */
function formatDuration(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

// =============================================================================
// Animation Component
// =============================================================================

/**
 * AnimatedTrackTitle
 * Replicates the "title" variant animation from Text.tsx
 * - Letter-by-letter stagger
 * - Blur + Opacity + Slide in
 */
function AnimatedTrackTitle({ text, className }: { text: string; className?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  let letterIndex = 0;

  const words = text.split(" ");

  return (
    <h3 ref={ref} className={cn("block", className)}>
      {words.map((word, wIdx) => (
        <span
          key={`word-${wIdx}`}
          className="inline-block whitespace-pre"
          style={{
            fontFamily: "var(--font-primary)",
            fontWeight: 900,
          }}
        >
          {word.split("").map((letter, lIdx) => {
            const delay = letterIndex * 0.02;
            letterIndex++;

            return (
              <motion.span
                key={`letter-${wIdx}-${lIdx}`}
                initial={{
                  opacity: 0,
                  x: "-100%",
                  filter: "blur(5px)",
                }}
                animate={
                  isInView
                    ? { opacity: 1, x: 0, filter: "blur(0px)" }
                    : { opacity: 0, x: "-100%", filter: "blur(5px)" }
                }
                transition={{
                  delay,
                  duration: 0.3,
                  ease: [0.1, 0.71, 0.88, 1],
                }}
                style={{
                  display: "inline-block",
                  transformOrigin: "bottom center",
                }}
              >
                {letter}
              </motion.span>
            );
          })}
          {/* Space after word (except last) */}
          {wIdx < words.length - 1 && <span className="inline-block w-[0.25em]">&nbsp;</span>}
        </span>
      ))}
    </h3>
  );
}

// =============================================================================
// Component
// =============================================================================

export function SoundcloudTrackCard({
  track,
  isExpanded,
  onExpand,
  className,
}: SoundcloudTrackCardProps) {
  // Use artwork or fallback
  const artworkUrl = track.artworkUrl?.replace("-large", "-t500x500") ?? "";

  const CardContent = (
    <article
      onMouseEnter={onExpand}
      className={cn(
        // Base layout
        "relative overflow-hidden cursor-pointer",
        "rounded-xl",

        // Smooth transition for all properties including flex
        "transition-all duration-500 ease-in-out",

        // =====================================================================
        // Mobile Layout (Vertical Accordion)
        // =====================================================================
        "w-full", // Always full width in column stack
        "flex-shrink-0", // Don't shrink below basis

        // Mobile Flex Basis (Height Control):
        // Expanded: Large basis (e.g. 300px) to show cover + info
        // Collapsed: Small basis (e.g. 60px) sliver
        isExpanded ? "flex-[0_0_100vw]" : "flex-[1_1_100px] md:flex-[0_0_150px]",

        // =====================================================================
        // Desktop Layout (Horizontal Accordion)
        // =====================================================================
        "lg:w-auto lg:h-full", // Auto width, full height

        // Desktop Flex Basis (Width Control):
        // Expanded: Fixed 1:1 Square (matching container height)
        // Collapsed: Fill remaining space
        isExpanded
          ? "lg:flex-[0_0_400px] xl:lg:flex-[0_0_450px] 2xl:lg:flex-[0_0_500px]"
          : "lg:flex-[1_1_0%]",

        // Minimum width constraints for desktop
        "lg:min-w-[80px]",

        className,
      )}
    >
      {/* Background Image */}
      {artworkUrl && (
        <OptimizedImage
          src={artworkUrl}
          alt={track.title}
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 33vw"
        />
      )}

      {/* Gradient Overlay */}
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent",
          "transition-opacity duration-300",
          isExpanded ? "opacity-100" : "opacity-70",
        )}
      />

      {/* Content - Only visible when expanded */}
      <div
        className={cn(
          "absolute inset-0 p-5 lg:p-6 flex flex-col justify-end",
          "transition-opacity duration-300",
          isExpanded ? "opacity-100" : "opacity-0",
        )}
      >
        {/* Track Info */}
        <div className="space-y-4">
          {/* Animated Title */}
          {isExpanded ? (
            <AnimatedTrackTitle
              text={track.title}
              className="line-clamp-3 text-lg lg:text-xl xl:text-2xl text-foreground uppercase tracking-tight"
            />
          ) : (
            // Placeholder for layout stability if needed, though opacity handles visibility
            <div className="h-8" />
          )}

          <div className="flex items-center gap-3">
            <Text variant="content" className="text-foreground/50 text-sm font-bold">
              {formatDuration(track.durationMs)}
            </Text>
          </div>
        </div>
      </div>

      {/* Duration badge - visible when collapsed (Desktop) */}
      <div
        className={cn(
          "absolute left-4 top-1/2 translate-y-1/2 lg:bottom-4 lg:left-1/2 lg:-translate-x-1/2",
          "transition-opacity duration-300",
          isExpanded ? "opacity-0" : "opacity-100",
        )}
      >
        <Text
          variant="content"
          className="text-foreground/80 font-bold text-xs whitespace-nowrap lg:[writing-mode:vertical-rl] lg:rotate-180"
        >
          {formatDuration(track.durationMs)}
        </Text>
      </div>

      {/* Link Overlay (Pseudo-element behavior via inset-0 Link) */}
      {/* We wrap the whole logic in a Link component below, so this is just visual structure */}
    </article>
  );

  // Wrap entire card in Link to make it clickable
  // Stop propagation on hover expansion logic handled by wrapper
  return (
    <Link
      href={track.permalinkUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="contents" // Allows the article to participate in the flex container directly
      onClick={(e) => {
        // Only navigate if actually clicking, but allow expansion
        if (!isExpanded) {
          e.preventDefault();
          onExpand();
        }
      }}
    >
      {CardContent}
    </Link>
  );
}

// =============================================================================
// SoundCloud Icon
// =============================================================================

function SoundcloudIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M1.175 12.225c-.051 0-.094.046-.101.1l-.233 2.154.233 2.105c.007.058.05.098.101.098.05 0 .09-.04.099-.098l.255-2.105-.27-2.154c-.009-.06-.052-.1-.099-.1m-.899.828c-.06 0-.091.037-.104.094L0 14.479l.165 1.308c.014.057.045.094.09.094s.089-.037.099-.094l.19-1.308-.21-1.319c-.012-.064-.047-.094-.099-.094m1.83-1.229c-.061 0-.12.045-.12.104l-.21 2.563.225 2.458c0 .06.045.104.106.104.061 0 .12-.044.12-.104l.24-2.458-.255-2.563c0-.06-.06-.104-.106-.104m.945-.089c-.075 0-.135.06-.15.135l-.193 2.64.21 2.544c.016.077.075.138.149.138.075 0 .135-.06.15-.137l.24-2.545-.24-2.64c-.015-.075-.075-.135-.166-.135m.893-.506c-.09 0-.15.06-.165.15l-.18 3.146.18 2.46c.014.09.074.15.164.15.09 0 .15-.061.165-.15l.21-2.46-.21-3.146c-.014-.09-.074-.15-.164-.15m.961-.481c-.105 0-.166.075-.18.165l-.165 3.627.18 2.355c.014.09.074.165.18.165.104 0 .164-.074.178-.165l.195-2.355-.209-3.627c-.014-.09-.074-.165-.18-.165m1.02-.12c-.119 0-.194.09-.209.194l-.165 3.748.18 2.265c.015.105.09.18.209.18.12 0 .195-.09.21-.18l.195-2.265-.21-3.748c-.014-.12-.089-.195-.21-.195m1.005-.105c-.135 0-.225.105-.225.225l-.15 3.853.165 2.175c0 .135.09.225.225.225s.225-.09.225-.225l.165-2.175-.165-3.853c0-.12-.09-.225-.24-.225m.93.449c-.12-.015-.225.09-.24.225l-.15 3.403.165 2.13c.015.135.12.24.255.24.12 0 .24-.105.255-.24l.15-2.13-.165-3.403c-.014-.135-.12-.24-.255-.225m.96-.255c-.15 0-.27.12-.285.255l-.12 3.658.135 2.085c.015.15.135.27.285.27.135 0 .27-.12.27-.27l.15-2.085-.15-3.658c-.014-.15-.12-.27-.285-.27m1.02-.12c-.165 0-.3.135-.3.3l-.12 3.778.12 2.04c.015.165.135.3.3.3s.285-.135.3-.3l.135-2.04-.135-3.778c-.015-.165-.135-.3-.3-.3m1.02.15c-.18 0-.315.15-.33.315l-.105 3.313.105 1.995c.015.18.15.315.33.315.18 0 .315-.135.33-.315l.12-1.995-.12-3.313c-.015-.165-.15-.315-.33-.315m1.005.255c-.18 0-.345.165-.345.345l-.09 3.057.09 1.965c.015.195.165.345.345.345.195 0 .345-.15.36-.345l.105-1.965-.105-3.057c-.015-.18-.165-.345-.36-.345m1.02.045c-.195 0-.36.165-.375.36l-.09 3.012.105 1.92c.015.195.18.36.375.36.18 0 .36-.165.375-.36l.09-1.92-.105-3.012c-.014-.195-.18-.36-.375-.36m2.355-.54c-.21-.015-.39.165-.405.375l-.075 3.177.09 1.875c.015.21.195.375.405.375.195 0 .375-.165.39-.375l.105-1.875-.105-3.177c-.015-.21-.195-.39-.405-.375m-1.185.495c-.21 0-.375.18-.39.39l-.075 3.087.09 1.89c.015.21.18.375.39.375.195 0 .375-.165.39-.375l.105-1.89-.105-3.087c-.015-.21-.195-.39-.405-.39m3.555-.675c-.27 0-.48.21-.495.48l-.06 3.36.075 1.845c.015.255.225.465.48.465.255 0 .465-.21.495-.465l.09-1.845-.105-3.36c-.015-.27-.225-.48-.48-.48m-1.185.315c-.24 0-.435.195-.45.435l-.075 3.33.09 1.86c.015.24.21.42.45.42.225 0 .42-.18.435-.42l.105-1.86-.105-3.33c-.015-.24-.21-.435-.45-.435m2.355-.27c-.24 0-.45.21-.465.45l-.06 3.375.06 1.83c.015.24.225.435.465.435.24 0 .45-.195.465-.435l.075-1.83-.075-3.375c-.015-.24-.225-.45-.465-.45m1.185.165c-.27 0-.48.21-.495.465l-.045 3.21.06 1.8c.015.255.225.45.48.45.255 0 .465-.195.495-.45l.075-1.8-.075-3.21c-.015-.255-.24-.465-.495-.465m1.185.045c-.285 0-.51.225-.51.495l-.045 3.18.045 1.77c.015.27.225.48.51.48.27 0 .495-.21.51-.48l.06-1.77-.06-3.18c-.015-.27-.24-.495-.51-.495m2.37.03c-.285 0-.525.24-.525.51l-.03 3.15.045 1.74c.015.285.24.495.525.495.27 0 .51-.21.525-.495l.045-1.74-.06-3.15c-.015-.27-.24-.51-.525-.51m-1.185-.015c-.285 0-.51.225-.525.51l-.03 3.165.045 1.755c0 .27.24.495.51.495s.51-.225.525-.495l.06-1.755-.045-3.165c-.015-.285-.24-.51-.525-.51m2.355.105c-.27 0-.51.24-.51.51v.015l-.03 3.045.03 1.725c.015.285.24.51.51.51.27 0 .495-.225.51-.51l.045-1.725-.045-3.06c-.015-.27-.24-.51-.51-.51m1.185.495c-.27 0-.495.225-.495.495l-.015 2.565.03 1.71c.015.27.225.48.48.48.27 0 .495-.21.51-.48l.03-1.71-.03-2.565c-.015-.27-.24-.495-.51-.495m1.35-.495c-.285 0-.51.225-.525.51l-.015 2.565.03 1.725c.015.285.24.495.51.495.285 0 .51-.21.525-.495l.045-1.725-.045-2.565c-.015-.285-.24-.51-.525-.51" />
    </svg>
  );
}

export default SoundcloudTrackCard;
