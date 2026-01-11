"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { twMerge } from "tailwind-merge";

interface AnimatedSeparatorProps {
  className?: string;
  direction?: "vertical" | "horizontal";
  once?: boolean;
}

const AnimatedSeparator = ({
  className,
  direction = "horizontal",
  once = false,
}: AnimatedSeparatorProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once });

  return (
    <div
      ref={ref}
      className={twMerge(
        "overflow-hidden",
        direction === "horizontal" && "w-full h-px mx-auto",
        direction === "vertical" && "h-full w-px",
        className,
      )}
    >
      <motion.div
        initial={direction === "horizontal" ? { scaleX: 0 } : { scaleY: 0 }}
        animate={
          isInView
            ? direction === "horizontal"
              ? { scaleX: 1 }
              : { scaleY: 1 }
            : direction === "horizontal"
            ? { scaleX: 0 }
            : { scaleY: 0 }
        }
        transition={{
          delay: 0.2,
          duration: 1.5,
          ease: [0.77, 0, 0.18, 1],
        }}
        style={{
          width: "100%",
          height: "100%",
          transformOrigin: "center",
        }}
        className={twMerge(`bg-[#4F4F4F] rounded-full`)}
      />
    </div>
  );
};

export default AnimatedSeparator;
