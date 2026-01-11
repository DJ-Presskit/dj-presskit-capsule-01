"use client";
import React, { useRef, createElement } from "react";
import { motion, useInView } from "framer-motion";
import { twMerge } from "tailwind-merge";

export type TextVariant = "titleOutline" | "title" | "subtitle" | "content" | "custom";

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
}

export const VARIANTS = {
  titleOutline:
    "uppercase relative text-4xl md:text-7xl lg:text-8xl xl:text-9xl -z-10 text-transparent [-webkit-text-stroke:1px_rgba(79,79,79,0.50)]",

  title: "uppercase text-5xl md:text-6xl lg:text-7xl xl:text-8xl tracking-[-4px]",

  subtitle: "ext-2xl md:text-3xl lg:text-4xl xl:text-5xl",

  content: "text-base lg:text-lg font-light leading-relaxed",

  custom: "",
} as const;

export const Text: React.FC<TextProps> = ({
  children,
  as = "span",
  className,
  variant,
  titleAnimation = true,
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 }); // Trigger when 50% visible

  // Merge classes with variants
  const classes = twMerge(VARIANTS[variant], className);

  if (variant === "titleOutline") {
    return createElement(
      as,
      {
        className: twMerge(classes),
        style: {
          fontFamily: "var(--font-sans)",
          fontWeight: 900,
        },
      },
      children,
    );
  }

  // Animated Title Logic
  if (variant === "title" && titleAnimation) {
    let letterIndex = 0; // Accumulated counter for staggered delays

    const animatedContent = React.Children.toArray(children).flatMap((child, i) => {
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
  return createElement(as, { className: classes }, children);
};

export default Text;
