/**
 * Capsule-01 Middleware
 *
 * Adds watermark header for routing diagnosis.
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const response = NextResponse.next();

  // WATERMARK: Identifies this response came from capsule-01
  response.headers.set("x-djp-app", "capsule-01");

  return response;
}

export const config = {
  matcher: ["/:path*"],
};
