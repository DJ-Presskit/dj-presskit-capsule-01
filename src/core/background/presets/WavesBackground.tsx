"use client";

import { useEffect, useRef, useCallback, useMemo } from "react";

export interface WavesBackgroundProps {
  /**
   * Line color - will use baseColor from theme if not specified
   */
  lineColor?: string;
  backgroundColor?: string;
  waveSpeedX?: number;
  waveSpeedY?: number;
  waveAmpX?: number;
  waveAmpY?: number;
  friction?: number;
  tension?: number;
  maxCursorMove?: number;
  xGap?: number;
  yGap?: number;
  /**
   * Base color from theme - used as lineColor if lineColor not specified
   */
  baseColor?: string;
  className?: string;
}

interface Point {
  x: number;
  y: number;
  originX: number;
  originY: number;
  noiseOffsetX: number;
  noiseOffsetY: number;
}

interface MouseState {
  x: number;
  y: number;
  lerpX: number;
  lerpY: number;
}

/**
 * WavesBackground - Animated wave lines (React Bits style)
 *
 * Canvas-based animated background with sinusoidal wave lines
 * that respond to cursor movement.
 *
 * Client-only component - uses canvas API.
 */
export default function WavesBackground({
  lineColor,
  backgroundColor = "transparent",
  waveSpeedX = 0.02,
  waveSpeedY = 0.01,
  waveAmpX = 40,
  waveAmpY = 20,
  friction = 0.9,
  tension = 0.01,
  maxCursorMove = 120,
  xGap = 12,
  yGap = 36,
  baseColor = "#383838",
  className = "",
}: WavesBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>(0);
  const pointsRef = useRef<Point[][]>([]);
  const mouseRef = useRef<MouseState>({ x: 0, y: 0, lerpX: 0, lerpY: 0 });
  const timeRef = useRef(0);

  // Use lineColor if provided, otherwise fall back to baseColor
  const effectiveLineColor = lineColor || baseColor;

  // Initialize points grid
  const initPoints = useCallback(
    (width: number, height: number) => {
      const points: Point[][] = [];
      const cols = Math.ceil(width / xGap) + 1;
      const rows = Math.ceil(height / yGap) + 1;

      for (let j = 0; j < rows; j++) {
        const row: Point[] = [];
        for (let i = 0; i < cols; i++) {
          const x = i * xGap;
          const y = j * yGap;
          row.push({
            x,
            y,
            originX: x,
            originY: y,
            noiseOffsetX: Math.random() * 1000,
            noiseOffsetY: Math.random() * 1000,
          });
        }
        points.push(row);
      }
      pointsRef.current = points;
    },
    [xGap, yGap],
  );

  // Simple noise function
  const noise = useMemo(() => {
    const permutation = Array.from({ length: 256 }, (_, i) => i).sort(() => Math.random() - 0.5);
    const p = [...permutation, ...permutation];

    const fade = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);
    const lerp = (a: number, b: number, t: number) => a + t * (b - a);
    const grad = (hash: number, x: number) => ((hash & 1) === 0 ? x : -x);

    return (x: number) => {
      const X = Math.floor(x) & 255;
      const xf = x - Math.floor(x);
      const u = fade(xf);
      return lerp(grad(p[X], xf), grad(p[X + 1], xf - 1), u);
    };
  }, []);

  // Animation loop
  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const { width, height } = canvas;
    const mouse = mouseRef.current;
    const points = pointsRef.current;

    // Clear canvas
    if (backgroundColor === "transparent") {
      ctx.clearRect(0, 0, width, height);
    } else {
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, width, height);
    }

    // Update time
    timeRef.current += 0.016;
    const time = timeRef.current;

    // Lerp mouse position
    mouse.lerpX += (mouse.x - mouse.lerpX) * 0.1;
    mouse.lerpY += (mouse.y - mouse.lerpY) * 0.1;

    // Update points
    for (const row of points) {
      for (const point of row) {
        // Wave motion
        const waveX = Math.sin(time * waveSpeedX * 60 + point.noiseOffsetX) * waveAmpX;
        const waveY = Math.sin(time * waveSpeedY * 60 + point.noiseOffsetY) * waveAmpY;

        // Noise displacement
        const noiseVal = noise(point.noiseOffsetX + time * 0.5) * 20;

        // Mouse influence
        const dx = mouse.lerpX - point.x;
        const dy = mouse.lerpY - point.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const maxDist = 200;

        let mouseInfluenceX = 0;
        let mouseInfluenceY = 0;

        if (dist < maxDist && dist > 0) {
          const force = ((maxDist - dist) / maxDist) * maxCursorMove;
          mouseInfluenceX = (dx / dist) * force * -0.5;
          mouseInfluenceY = (dy / dist) * force * -0.5;
        }

        // Apply with spring physics
        const targetX = point.originX + waveX + noiseVal + mouseInfluenceX;
        const targetY = point.originY + waveY + mouseInfluenceY;

        point.x += (targetX - point.x) * tension;
        point.y += (targetY - point.y) * tension;
      }
    }

    // Draw lines
    ctx.strokeStyle = effectiveLineColor;
    ctx.lineWidth = 1;

    for (const row of points) {
      if (row.length < 2) continue;

      ctx.beginPath();
      ctx.moveTo(row[0].x, row[0].y);

      for (let i = 1; i < row.length - 1; i++) {
        const xc = (row[i].x + row[i + 1].x) / 2;
        const yc = (row[i].y + row[i + 1].y) / 2;
        ctx.quadraticCurveTo(row[i].x, row[i].y, xc, yc);
      }

      ctx.lineTo(row[row.length - 1].x, row[row.length - 1].y);
      ctx.stroke();
    }

    animationRef.current = requestAnimationFrame(animate);
  }, [
    backgroundColor,
    effectiveLineColor,
    maxCursorMove,
    noise,
    tension,
    waveAmpX,
    waveAmpY,
    waveSpeedX,
    waveSpeedY,
  ]);

  // Handle resize
  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const resize = () => {
      const { width, height } = container.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      const ctx = canvas.getContext("2d");
      if (ctx) ctx.scale(dpr, dpr);

      initPoints(width, height);
    };

    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [initPoints]);

  // Mouse tracking
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;
    };

    container.addEventListener("mousemove", handleMouseMove);
    return () => container.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Start animation
  useEffect(() => {
    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [animate]);

  return (
    <div ref={containerRef} className={`absolute inset-0 overflow-hidden ${className}`}>
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
    </div>
  );
}
