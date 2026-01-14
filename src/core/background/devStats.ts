/**
 * Dev Stats - Background performance diagnostics (dev only)
 *
 * Exposes window.__DJP_BG_STATS__ for debugging
 */

import type { BackgroundDevStats, BackgroundQuality } from "./types";

// Extend window type
declare global {
  interface Window {
    __DJP_BG_STATS__?: BackgroundDevStats;
  }
}

class DevStatsTracker {
  private framesRendered = 0;
  private tickTimes: number[] = [];
  private invalidatesThisSecond = 0;
  private lastSecondTimestamp = 0;
  private invalidatesPerSecond = 0;

  private quality: BackgroundQuality = "high" as BackgroundQuality;
  private targetFPS = 60;
  private isAnimating = false;
  private activePreset = "";
  private isTabActive = true;

  constructor() {
    if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
      this.expose();
    }
  }

  recordTick(tickDurationMs: number) {
    this.framesRendered++;
    this.tickTimes.push(tickDurationMs);
    if (this.tickTimes.length > 60) {
      this.tickTimes.shift();
    }
    this.invalidatesThisSecond++;
  }

  updateSecond(timestamp: number) {
    if (timestamp - this.lastSecondTimestamp >= 1000) {
      this.invalidatesPerSecond = this.invalidatesThisSecond;
      this.invalidatesThisSecond = 0;
      this.lastSecondTimestamp = timestamp;
    }
  }

  setQuality(q: BackgroundQuality) {
    this.quality = q;
  }

  setTargetFPS(fps: number) {
    this.targetFPS = fps;
  }

  setIsAnimating(v: boolean) {
    this.isAnimating = v;
  }

  setActivePreset(p: string) {
    this.activePreset = p;
  }

  setIsTabActive(v: boolean) {
    this.isTabActive = v;
  }

  private get averageTickMs(): number {
    if (this.tickTimes.length === 0) return 0;
    const sum = this.tickTimes.reduce((a, b) => a + b, 0);
    return sum / this.tickTimes.length;
  }

  private expose() {
    if (typeof window === "undefined") return;

    // Use defineProperty for live stats
    Object.defineProperty(window, "__DJP_BG_STATS__", {
      get: () => ({
        framesRendered: this.framesRendered,
        averageTickMs: Math.round(this.averageTickMs * 100) / 100,
        invalidatesPerSecond: this.invalidatesPerSecond,
        quality: this.quality,
        targetFPS: this.targetFPS,
        isAnimating: this.isAnimating,
        activePreset: this.activePreset,
        isTabActive: this.isTabActive,
      }),
      configurable: true,
    });
  }

  log() {
    if (process.env.NODE_ENV !== "development") return;
    console.log("[BG Stats]", {
      frames: this.framesRendered,
      avgTick: `${this.averageTickMs.toFixed(2)}ms`,
      ips: this.invalidatesPerSecond,
      quality: this.quality,
      fps: this.targetFPS,
      animating: this.isAnimating,
      preset: this.activePreset,
    });
  }
}

// Singleton instance
export const devStats = new DevStatsTracker();
