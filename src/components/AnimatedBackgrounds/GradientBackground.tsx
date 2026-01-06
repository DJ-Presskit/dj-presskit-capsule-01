"use client";

import { useEffect, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";

interface GradientBackgroundProps {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
  colors?: string[]; // Hex colors
  followCursor?: boolean;
}

const DEFAULT_COLORS = ["#c83232", "#dd4aff", "#64dcff", "#b4b432"];
export default function GradientBackground({
  children,
  className,
  containerClassName,
  colors = DEFAULT_COLORS,
  followCursor = false,
}: GradientBackgroundProps) {
  const cursorRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [targetCoords, setTargetCoords] = useState({ x: 0, y: 0 });
  const [currentCoords, setCurrentCoords] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!followCursor || !cursorRef.current) return;

    let animationFrameId: number;

    const smoothMove = () => {
      const lerp = (a: number, b: number, n: number) => a + (b - a) * n;

      setCurrentCoords((prev) => {
        const newX = lerp(prev.x, targetCoords.x, 0.1);
        const newY = lerp(prev.y, targetCoords.y, 0.1);

        if (cursorRef.current) {
          cursorRef.current.style.left = `${newX}px`;
          cursorRef.current.style.top = `${newY}px`;
        }

        return { x: newX, y: newY };
      });

      animationFrameId = requestAnimationFrame(smoothMove);
    };

    animationFrameId = requestAnimationFrame(smoothMove);
    return () => cancelAnimationFrame(animationFrameId);
  }, [targetCoords, followCursor]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!followCursor || !containerRef.current) return;
    const x = e.clientX; // offset to center
    const y = e.clientY;
    setTargetCoords({ x, y });
  };

  const hexToRgba = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  const getLayerStyle = (hex: string, delay?: string, anim?: string) => ({
    background: `radial-gradient(circle at center, ${hexToRgba(
      hex,
      0.8
    )} 0, ${hexToRgba(hex, 0)} 70%) no-repeat`,
    mixBlendMode: "hard-light" as const,
    animation: anim || "moveInCircle 15s ease infinite",
    animationDelay: delay || "0s",
  });

  return (
    <div
      ref={containerRef}
      className={twMerge("relative overflow-hidden", containerClassName)}
      onMouseMove={handleMouseMove}
    >
      <div className={twMerge("relative z-10", className)}>{children}</div>
      <div className="absolute inset-0 blur-xl pointer-events-none">
        {colors.slice(0, 3).map((color, idx) => {
          const animations = ["moveInCircle", "moveVertical", "moveHorizontal"];
          return (
            <div
              key={idx}
              className="absolute w-full h-full opacity-20"
              style={getLayerStyle(
                color,
                `${idx * 5}s`,
                `${animations[idx % animations.length]} ${
                  30 + idx * 15
                }s ease infinite`
              )}
            />
          );
        })}

        {followCursor && colors[2] && (
          <div
            ref={cursorRef}
            className="absolute w-[500px] h-[500px] opacity-20 -translate-x-1/2 -translate-y-1/2 transition-transform duration-300"
            style={getLayerStyle(colors[2])}
          />
        )}
      </div>
    </div>
  );
}
