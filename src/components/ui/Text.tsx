"use client";
import React, { useRef, createElement } from "react";
import { motion, useInView } from "framer-motion";
import { twMerge } from "tailwind-merge";
import { useI18n } from "@/core/i18n";

export type TextVariant =
  | "customOutline"
  | "titleOutline"
  | "title"
  | "subtitle"
  | "content"
  | "custom";

/**
 * Valid HTML element types for the `as` prop.
 */
export type TextElement = "span" | "p" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "div" | "label";

export interface TextProps {
  children?: React.ReactNode;
  as?: TextElement;
  className?: string;
  variant: TextVariant;
  titleAnimation?: boolean; // Only applies to 'title' variant
  /** Translation key (e.g. "title" or "about.title") */
  tKey?: string;
  /** Namespace to prefix tKey (e.g. ns="about" + tKey="title" = "about.title") */
  ns?: string;
}

export const VARIANTS = {
  titleOutline:
    "uppercase text-4xl min-[400px]:text-4xl min-[500px]:text-5xl md:text-6xl lg:text-7xl 2xl:text-[100px] min-[2500px]:text-[125px] tracking-[-4px] -z-10 text-transparent [-webkit-text-stroke:1px_rgba(79,79,79)] scale-85",

  title:
    "text-foreground uppercase text-4xl min-[400px]:text-4xl min-[500px]:text-5xl md:text-6xl lg:text-7xl 2xl:text-[100px] min-[2500px]:text-[125px] tracking-[-4px]",

  subtitle: "text-2xl md:text-3xl lg:text-4xl xl:text-5xl text-foreground uppercase font-extrabold",

  content: "text-base lg:text-lg font-light leading-relaxed whitespace-pre-line text-foreground",

  custom: "",
  customOutline: "text-transparent [-webkit-text-stroke:2px_rgba(90,90,90)]",
} as const;

export const Text: React.FC<TextProps> = ({
  children,
  as = "span",
  className,
  variant,
  titleAnimation = true,
  tKey,
  ns,
}) => {
  const { t } = useI18n();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 }); // Trigger when 50% visible

  /**
   * Resolve the content to display:
   * 1. If tKey is provided, use it (with optional ns prefix)
   * 2. If children is a string with a dot, treat it as a translation key
   * 3. Otherwise, use children as-is
   */
  const resolveContent = (): React.ReactNode => {
    // Explicit translation key
    if (tKey) {
      const fullKey = ns ? `${ns}.${tKey}` : tKey;
      return t(fullKey);
    }

    // Auto-detect: if children is a string containing a dot, treat as translation key
    if (typeof children === "string" && children.includes(".")) {
      return t(children);
    }

    // Return children as-is
    return children;
  };

  const content = resolveContent();

  // Merge classes with variants
  const classes = twMerge(VARIANTS[variant], className);

  if (variant === "titleOutline" || variant === "customOutline") {
    return createElement(
      as,
      {
        className: twMerge(classes),
        style: {
          fontFamily: "var(--font-sans)",
          fontWeight: 900,
        },
      },
      content,
    );
  }

  // Animated Title Logic
  if (variant === "title" && titleAnimation) {
    let letterIndex = 0; // Accumulated counter for staggered delays

    const animatedContent = React.Children.toArray(content).flatMap((child, i) => {
      if (typeof child === "string") {
        // Split into words
        const words = child.split(" ");
        return words.map((word: string, wIdx: number) => (
          <span
            key={`word-${i}-${wIdx}`}
            className="inline-block whitespace-pre" // Explicit font family for spans
            style={{
              fontFamily: "var(--font-primary)",
              fontWeight: 900,
            }}
          >
            {word.split("").map((letter: string, lIdx: number) => {
              const delay = letterIndex * 0.05; // 30ms stagger per letter
              letterIndex++;

              return (
                <motion.span
                  key={`letter-${i}-${wIdx}-${lIdx}`}
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
                    fontFamily: "var(--font-primary)",
                  }}
                >
                  {letter}
                </motion.span>
              );
            })}
            {/* Space after word (except last) */}
            {wIdx < words.length - 1 && <span className="inline-block w-[0.25em]">&nbsp;</span>}
          </span>
        ));
      }

      // Non-string children rendered normally
      return <React.Fragment key={`element-${i}`}>{child}</React.Fragment>;
    });

    return (
      <div ref={ref}>
        {createElement(as, { className: twMerge(classes, "block") }, animatedContent)}
      </div>
    );
  }

  // Standard Render (No Animation)
  return createElement(as, { className: classes }, content);
};

export default Text;
