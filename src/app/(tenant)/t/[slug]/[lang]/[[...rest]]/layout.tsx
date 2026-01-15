import type { SupportedLang } from "@/types";
import { SUPPORTED_LANGS } from "@/types";

interface TenantLayoutProps {
  children: React.ReactNode;
  params: Promise<{
    slug: string;
    lang: string;
    rest?: string[];
  }>;
}

/**
 * Validate and normalize language parameter
 */
function validateLang(lang: string): SupportedLang {
  if (SUPPORTED_LANGS.includes(lang as SupportedLang)) {
    return lang as SupportedLang;
  }
  return "es"; // Default fallback
}

/**
 * Layout for tenant pages
 * Sets the HTML lang attribute based on the route segment
 */
export default async function TenantLayout({ children, params }: TenantLayoutProps) {
  // We don't strictly need to validate lang here for rendering if parent handles it or if it's just passing children.
  // But let's keep the hook call to await params to avoid unused var or if it was doing something else (it was just validating).
  // Actually, we can just return children.
  await params; // consume params to satisfy linter if needed, or just remove.
  return <>{children}</>;
}
