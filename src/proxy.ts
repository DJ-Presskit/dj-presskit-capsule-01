/**
 * Middleware - NEUTRALIZED for Router-First Architecture
 * 
 * This capsule no longer resolves tenants by host. The external Router
 * (dj-presskit-router) handles:
 * - Host → slug resolution via API
 * - Canonical redirects
 * - Capsule selection by templateKey
 * 
 * The Router rewrites requests to this capsule as:
 *   /t/{slug}/{lang}{restPath}?query
 * 
 * This middleware has an empty matcher - it intercepts nothing.
 * All rendering is handled by the /t/[slug]/[lang]/[[...rest]] route.
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// ============================================================================
// Middleware Function (Required by Next.js, but never runs due to empty matcher)
// ============================================================================

export function proxy(_request: NextRequest) {
  // This function is never called because the matcher is empty.
  // It exists only to satisfy Next.js's requirement for a middleware export.
  return NextResponse.next();
}

// ============================================================================
// Matcher Configuration - EMPTY (Middleware Disabled)
// ============================================================================

export const config = {
  // Empty matcher = middleware never runs
  // All host resolution is done by the external Router
  matcher: [],
};
