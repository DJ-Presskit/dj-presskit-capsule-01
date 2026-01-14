/**
 * Background Module - Barrel Export
 *
 * Phase 2 Architecture:
 * - BackgroundProvider + BackgroundStage (single RAF ticker)
 * - SectionSentinel for visibility-based preset switching
 * - Quality-based performance scaling with octave weights
 * - frameloop="demand" on all R3F presets
 *
 * Legacy:
 * - BackgroundRenderer (kept for backward compat)
 */

// Core optimized system
export { BackgroundProvider, useBackgroundContext } from "./BackgroundContext";
export { BackgroundStage } from "./BackgroundStage";
export { SectionSentinel } from "./SectionSentinel";
export { useBackgroundPerformance } from "./hooks/useBackgroundPerformance";
export { devStats } from "./devStats";
export { createFrameClock, createFPSThrottler } from "./FrameClock";
export * from "./types";

// Legacy (kept for backward compatibility)
export { BackgroundRenderer } from "./BackgroundRenderer";
export { normalizeTheme } from "./normalizeTheme";
export type { ApiTheme, NormalizedBackgroundState } from "./normalizeTheme";
export * from "./backgroundCatalog";
