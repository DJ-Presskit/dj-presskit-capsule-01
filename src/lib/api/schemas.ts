/**
 * Zod schemas for API response validation
 */

import { z } from "zod";

// ============================================================================
// Minimal Presskit Schema
// Validates only essential fields required for rendering
// ============================================================================

export const PresskitSeoSchema = z.object({
  canonicalUrl: z.string().optional(),
  title: z.string().optional(),
  description: z.string().optional(),
  keywords: z.array(z.string()).optional(),
  ogImageUrl: z.string().optional(),
  ogImageWidth: z.number().optional(),
  ogImageHeight: z.number().optional(),
  faviconSet: z.object({
    icon16: z.string(),
    icon32: z.string(),
    icon48: z.string(),
    apple180: z.string(),
    icon192: z.string(),
    icon512: z.string(),
    version: z.string(),
  }).optional(),
}).passthrough();

export const PresskitProfileSchema = z.object({
  shortBio: z.string().optional(),
  longBio: z.string().optional(),
  location: z.string().optional(),
  eventTypes: z.string().optional(),
  yearsOfExperience: z.number().optional(),
  totalEvents: z.number().optional(),
  genres: z.array(z.string()).optional(),
}).passthrough();

export const PresskitThemeSchema = z.object({
  accentColor: z.string(),
  backgroundTint: z.string().nullable().optional(),
  background: z.object({
    mode: z.enum(["preset", "image", "video", "none"]).optional(),
    presetId: z.string().optional(),
    presetConfig: z.record(z.string(), z.unknown()).optional(),
    imageUrl: z.string().optional(),
    videoUrl: z.string().optional(),
    posterUrl: z.string().optional(),
    overlayOpacity: z.number().optional(),
    cloudflareStreamId: z.string().optional(),
  }).optional(),
}).passthrough();

/**
 * Minimal presskit schema - validates essential fields
 * Uses passthrough() to allow additional API fields
 */
export const PresskitMinimalSchema = z.object({
  slug: z.string(),
  artistName: z.string(),
  status: z.enum(["ACTIVE", "PAUSED", "IN_SETUP", "DELETED"]),
  profile: PresskitProfileSchema.optional(),
  theme: PresskitThemeSchema.optional(),
  seo: PresskitSeoSchema.optional(),
  updatedAt: z.string().optional(),
}).passthrough();

export type PresskitMinimal = z.infer<typeof PresskitMinimalSchema>;
