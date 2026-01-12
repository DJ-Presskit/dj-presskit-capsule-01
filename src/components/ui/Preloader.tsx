"use client";

/**
 * Preloader Component
 *
 * Full-screen preloader with glitch text effect.
 * Cycles through 6 different creative fonts over 2 seconds,
 * creating a visually dynamic effect before fading out.
 *
 * Features:
 * - 6 creative Google Fonts cycling rapidly
 * - Glitch/distortion visual effects
 * - Smooth fade-out transition ending with primary site font
 * - Responsive design
 * - Accessibility: respects prefers-reduced-motion
 * - No flash of unstyled text (FOUT)
 */

import { useState, useEffect } from "react";
import { usePresskit } from "@/context";

// ============================================================================
// Configuration
// ============================================================================

const PRELOADER_DURATION = 2500; // 2.5 seconds total
const FONT_CYCLE_INTERVAL = 120; // Change font every 120ms (faster for more fonts)
const FADE_DURATION = 800; // Fade out duration

// Primary site font (ends with this)
const PRIMARY_FONT = "var(--font-primary), sans-serif";

// Creative fonts loaded via Google Fonts
// Using distinct, creative typefaces for maximum visual impact
const GLITCH_FONTS = [
  '"Press Start 2P", cursive', // Pixel/retro style
  '"Rubik Glitch", system-ui', // Built-in glitch effect
  '"Monoton", sans-serif', // Retro outline deco
  '"Fascinate Inline", system-ui', // Inline decorative
  '"Permanent Marker", cursive', // Hand-drawn marker
  '"Bungee Shade", system-ui', // 3D layered block
  '"Creepster", cursive', // Horror style
  '"Orbitron", sans-serif', // Sci-fi futuristic
  '"Megrim", cursive', // Thin geometric
  '"Silkscreen", cursive', // Pixel clean
  '"Press Start 2P", cursive', // Repeat for variety
] as const;

// ============================================================================
// Component
// ============================================================================

interface PreloaderProps {
  /** Optional callback when preloader completes */
  onComplete?: () => void;
  /** Override duration in ms (default: 2000) */
  duration?: number;
}

export function Preloader({ onComplete, duration = PRELOADER_DURATION }: PreloaderProps) {
  const { presskit } = usePresskit();
  const artistName = presskit?.artistName || "LOADING";

  const [isVisible, setIsVisible] = useState(true);
  const [isFading, setIsFading] = useState(false);
  const [currentFontIndex, setCurrentFontIndex] = useState(0);
  const [glitchOffset, setGlitchOffset] = useState({ x: 0, y: 0 });
  const [fontsReady, setFontsReady] = useState(false);

  // Check for reduced motion preference
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  // Wait for fonts to load before showing text
  useEffect(() => {
    if (typeof document !== "undefined" && document.fonts) {
      document.fonts.ready.then(() => {
        // Small delay to ensure fonts are rendered
        setTimeout(() => setFontsReady(true), 50);
      });
    } else {
      // Fallback for browsers without font loading API
      setTimeout(() => setFontsReady(true), 100);
    }
  }, []);

  // Font cycling effect
  useEffect(() => {
    if (prefersReducedMotion || isFading) return;

    const interval = setInterval(() => {
      setCurrentFontIndex((prev) => (prev + 1) % GLITCH_FONTS.length);
      // Random glitch offset for visual distortion
      setGlitchOffset({
        x: (Math.random() - 0.5) * 8,
        y: (Math.random() - 0.5) * 4,
      });
    }, FONT_CYCLE_INTERVAL);

    return () => clearInterval(interval);
  }, [prefersReducedMotion, isFading]);

  // Main timer for preloader completion
  useEffect(() => {
    const fadeTimer = setTimeout(() => {
      setIsFading(true);
    }, duration - FADE_DURATION);

    const hideTimer = setTimeout(() => {
      setIsVisible(false);
      onComplete?.();
    }, duration);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, [duration, onComplete]);

  // Don't render if not visible
  if (!isVisible) return null;

  // Use primary font when fading, glitch fonts otherwise
  const currentFont = isFading
    ? PRIMARY_FONT
    : prefersReducedMotion
    ? GLITCH_FONTS[0]
    : GLITCH_FONTS[currentFontIndex];

  return (
    <>
      {/* Google Fonts preload for all creative fonts */}
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Rubik+Glitch&family=Monoton&family=Fascinate+Inline&family=Permanent+Marker&family=Bungee+Shade&family=Creepster&family=Orbitron&family=Megrim&family=Silkscreen&display=swap");
      `}</style>

      <div
        className="preloader"
        role="progressbar"
        aria-label="Loading content"
        aria-valuemin={0}
        aria-valuemax={100}
        style={{
          opacity: isFading ? 0 : 1,
        }}
      >
        {/* Main text - hidden until fonts are ready, split by words like Hero */}
        <div
          className="preloader__text-container"
          style={{
            opacity: fontsReady ? 1 : 0,
          }}
        >
          {artistName.split(" ").map((word, index) => (
            <div
              key={index}
              className="preloader__text"
              style={{
                fontFamily: currentFont,
                transform: prefersReducedMotion
                  ? "none"
                  : `translate(${glitchOffset.x}px, ${glitchOffset.y}px)`,
              }}
            >
              {word}
            </div>
          ))}
        </div>

        {/* Glitch layers (only when motion is allowed and fonts are ready) */}
        {!prefersReducedMotion && fontsReady && !isFading && (
          <>
            <div
              className="preloader__glitch-container preloader__glitch--red"
              style={{
                transform: `translate(${glitchOffset.x + 2}px, ${glitchOffset.y - 1}px)`,
              }}
            >
              {artistName.split(" ").map((word, index) => (
                <div
                  key={index}
                  className="preloader__glitch-text"
                  style={{ fontFamily: currentFont }}
                >
                  {word}
                </div>
              ))}
            </div>
            <div
              className="preloader__glitch-container preloader__glitch--cyan"
              style={{
                transform: `translate(${glitchOffset.x - 2}px, ${glitchOffset.y + 1}px)`,
              }}
            >
              {artistName.split(" ").map((word, index) => (
                <div
                  key={index}
                  className="preloader__glitch-text"
                  style={{ fontFamily: currentFont }}
                >
                  {word}
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <style jsx>{`
        .preloader {
          position: fixed;
          inset: 0;
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #000;
          transition: opacity ${FADE_DURATION}ms ease-out;
          overflow: hidden;
        }

        .preloader__text-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          transition: opacity 0.1s ease-out;
        }

        .preloader__text {
          position: relative;
          z-index: 2;
          color: #fff;
          font-size: 55px;
          line-height: 0.85;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          text-align: center;
          padding: 0 1rem;
          word-break: break-word;
          transition: font-family 0.05s ease-out, opacity 0.1s ease-out;
          animation: textPulse 0.1s infinite;
        }

        @media (min-width: 400px) {
          .preloader__text {
            font-size: 75px;
          }
        }
        @media (min-width: 500px) {
          .preloader__text {
            font-size: 85px;
          }
        }
        @media (min-width: 768px) {
          .preloader__text {
            font-size: 105px;
          }
        }
        @media (min-width: 1024px) {
          .preloader__text {
            font-size: 135px;
          }
        }
        @media (min-width: 1280px) {
          .preloader__text {
            font-size: 200px;
          }
        }
        @media (min-width: 1536px) {
          .preloader__text {
            font-size: 250px;
          }
        }
        @media (min-width: 2500px) {
          .preloader__text {
            font-size: 330px;
          }
        }

        .preloader__glitch-container {
          position: absolute;
          z-index: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          pointer-events: none;
          opacity: 0.8;
          mix-blend-mode: screen;
        }

        .preloader__glitch-text {
          font-size: 55px;
          line-height: 0.85;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          text-align: center;
          padding: 0 1rem;
          word-break: break-word;
        }

        @media (min-width: 400px) {
          .preloader__glitch-text {
            font-size: 75px;
          }
        }
        @media (min-width: 500px) {
          .preloader__glitch-text {
            font-size: 85px;
          }
        }
        @media (min-width: 768px) {
          .preloader__glitch-text {
            font-size: 105px;
          }
        }
        @media (min-width: 1024px) {
          .preloader__glitch-text {
            font-size: 135px;
          }
        }
        @media (min-width: 1280px) {
          .preloader__glitch-text {
            font-size: 200px;
          }
        }
        @media (min-width: 1536px) {
          .preloader__glitch-text {
            font-size: 250px;
          }
        }
        @media (min-width: 2500px) {
          .preloader__glitch-text {
            font-size: 330px;
          }
        }

        .preloader__glitch--red .preloader__glitch-text {
          color: #ff0040;
        }

        .preloader__glitch--cyan .preloader__glitch-text {
          color: #00ffff;
        }

        .preloader__glitch--red {
          clip-path: polygon(0 0, 100% 0, 100% 45%, 0 45%);
        }

        .preloader__glitch--cyan {
          clip-path: polygon(0 55%, 100% 55%, 100% 100%, 0 100%);
        }

        @keyframes textPulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.95;
          }
        }

        /* Scanline effect */
        .preloader::before {
          content: "";
          position: absolute;
          inset: 0;
          background: repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(0, 0, 0, 0.1) 2px,
            rgba(0, 0, 0, 0.1) 4px
          );
          pointer-events: none;
          z-index: 3;
        }

        /* Vignette effect */
        .preloader::after {
          content: "";
          position: absolute;
          inset: 0;
          background: radial-gradient(
            ellipse at center,
            transparent 0%,
            transparent 50%,
            rgba(0, 0, 0, 0.5) 100%
          );
          pointer-events: none;
          z-index: 3;
        }

        /* Reduced motion: no animations, simple display */
        @media (prefers-reduced-motion: reduce) {
          .preloader__text {
            animation: none;
            transition: none;
          }
        }
      `}</style>
    </>
  );
}

export default Preloader;
