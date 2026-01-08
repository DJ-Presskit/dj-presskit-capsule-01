/**
 * Capsule 01 - Domain Module Barrel Exports
 *
 * All normalizers, types, and validators for data transformation.
 */

// Types (ViewModels)
export * from "./types";

// Validators
export * from "./validators";

// Normalizers
export { normalizeAbout } from "./about/normalize";
export { normalizeGallery } from "./gallery/normalize";
export { normalizeEvents } from "./events/normalize";
export { normalizeReleases } from "./releases/normalize";
export { normalizeYoutube } from "./youtube/normalize";
export { normalizeRider } from "./rider/normalize";
export { normalizeSocials } from "./socials/normalize";
export { normalizeContact } from "./contact/normalize";
