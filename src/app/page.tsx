import { redirect } from "next/navigation";

/**
 * Root page - this should not be directly accessed
 * All traffic should be rewritten to /_tenant/[slug]/[lang] by middleware
 * This page is a fallback for direct access without proper host resolution
 */
export default function RootPage() {
  if (process.env.NODE_ENV === "development") {
    redirect("/t/john-doe/es");
  } else {
    redirect("/not-found-tenant");
  }
}
