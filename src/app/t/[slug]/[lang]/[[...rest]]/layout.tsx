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
export default async function TenantLayout({
  children,
  params,
}: TenantLayoutProps) {
  const { lang: rawLang } = await params;
  const lang = validateLang(rawLang);

  return (
    <html lang={lang}>
      <body>{children}</body>
    </html>
  );
}
