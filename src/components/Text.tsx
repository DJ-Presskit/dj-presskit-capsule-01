"use client";
import React, { useRef, createElement } from "react";
import { motion, useInView } from "framer-motion";
import { twMerge } from "tailwind-merge";

export type TextVariant = "title" | "subtitle" | "content" | "custom";

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
  // Bebas Neue (Primary) - Uppercase, Bold
  title:
    "font-primary font-bold uppercase text-5xl md:text-6xl lg:text-7xl xl:text-8xl tracking-tight",

  // Unbounded (Secondary)
  subtitle: "font-secondary text-2xl md:text-3xl lg:text-4xl xl:text-5xl",

  // Unbounded (Secondary) - Body text
  content: "font-secondary text-base lg:text-lg font-light leading-relaxed",

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
            className="inline-block whitespace-pre font-primary" // Explicit font family for spans
          >
            {word.split("").map((letter: string, lIdx: number) => {
              const delay = letterIndex * 0.03; // 30ms stagger per letter
              letterIndex++;

              return (
                <motion.div
                  key={`letter-${i}-${wIdx}-${lIdx}`}
                  initial={{
                    opacity: 0,
                    y: "100%", // Slide from fully below
                  }}
                  animate={
                    isInView
                      ? {
                          opacity: 1,
                          y: 0,
                        }
                      : {
                          opacity: 0,
                          y: "100%",
                        }
                  }
                  transition={{
                    delay,
                    duration: 0.5,
                    ease: [0.22, 1, 0.36, 1], // Cubic bezier styling
                  }}
                  style={{
                    display: "inline-block",
                    transformOrigin: "bottom center",
                  }}
                >
                  {letter}
                </motion.div>
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
      <div className="overflow-hidden" ref={ref}>
        {createElement(as, { className: twMerge(classes, "block text-center") }, animatedContent)}
      </div>
    );
  }

  // Standard Render (No Animation)
  return createElement(as, { className: classes }, children);
};

export default Text;
