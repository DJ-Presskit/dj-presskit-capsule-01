"use client";

/**
 * YouTubePlayer Component
 *
 * Modal overlay for embedded YouTube video playback.
 * Features:
 * - Privacy-enhanced embed (youtube-nocookie.com)
 * - Click outside or close button to dismiss
 * - Autoplay when opened
 */

import { useEffect, useCallback } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/cn";
import { getYoutubeEmbedUrl } from "@/domain/validators";
import { useI18n } from "@/core/i18n";

// =============================================================================
// Types
// =============================================================================

export interface YouTubePlayerProps {
  videoId: string;
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

// =============================================================================
// Component
// =============================================================================

export function YouTubePlayer({ videoId, isOpen, onClose, className }: YouTubePlayerProps) {
  const { t } = useI18n();
  const embedUrl = getYoutubeEmbedUrl(videoId, true);

  // Handle escape key
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose],
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, handleKeyDown]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className={cn(
            "fixed inset-0 z-50 flex items-center justify-center",
            "bg-background/90 backdrop-blur-sm",
            className,
          )}
          onClick={onClose}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            aria-label={t("youtube.close")}
            className={cn(
              "absolute top-4 right-4 z-10",
              "p-2 rounded-full bg-background-lighter/80 text-foreground",
              "hover:bg-accent hover:text-background transition-colors cursor-pointer",
            )}
          >
            <X className="w-6 h-6" />
          </button>

          {/* Video Container */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.2, delay: 0.1 }}
            className="w-full max-w-5xl mx-4 aspect-video"
            onClick={(e) => e.stopPropagation()}
          >
            <iframe
              src={embedUrl}
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full rounded-xl shadow-2xl"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default YouTubePlayer;
