/**
 * FrameClock - Global animation time source
 *
 * Provides a single source of truth for animation time.
 * Used by BackgroundStage to drive the single RAF ticker.
 * Presets read from this clock instead of maintaining their own.
 */

import type { FrameClockState } from "./types";

export function createFrameClock(): {
  state: FrameClockState;
  tick: (timestamp: number) => void;
  reset: () => void;
} {
  const state: FrameClockState = {
    time: 0,
    delta: 0,
    frameId: 0,
    lastFrameTime: 0,
  };

  let startTime: number | null = null;
  let lastTime = 0;

  function tick(timestamp: number) {
    if (startTime === null) {
      startTime = timestamp;
      lastTime = timestamp;
    }

    state.delta = (timestamp - lastTime) / 1000; // Convert to seconds
    state.time = (timestamp - startTime) / 1000;
    state.frameId++;
    state.lastFrameTime = timestamp;

    lastTime = timestamp;
  }

  function reset() {
    startTime = null;
    lastTime = 0;
    state.time = 0;
    state.delta = 0;
    state.frameId = 0;
    state.lastFrameTime = 0;
  }

  return { state, tick, reset };
}

/**
 * FPS Throttler - Only allow tick at target FPS rate
 */
export function createFPSThrottler(targetFPS: number) {
  const frameInterval = targetFPS > 0 ? 1000 / targetFPS : Infinity;
  let lastFrameTime = 0;

  return {
    shouldTick: (timestamp: number): boolean => {
      if (targetFPS <= 0) return false;
      const elapsed = timestamp - lastFrameTime;
      if (elapsed >= frameInterval) {
        lastFrameTime = timestamp - (elapsed % frameInterval);
        return true;
      }
      return false;
    },
    setTargetFPS: (fps: number) => {
      // Note: Can't directly update frameInterval due to closure
      // This is a factory function; recreate if FPS changes
    },
    reset: () => {
      lastFrameTime = 0;
    },
  };
}
