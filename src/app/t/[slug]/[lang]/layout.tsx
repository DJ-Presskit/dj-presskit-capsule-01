import { headers } from "next/headers";
import { normalizeLocale, type Locale } from "@/core/i18n";
import { TenantProvider } from "@/core/tenant-context";
import type { SupportedLang } from "@/types";

interface LangLayoutProps {
  children: React.ReactNode;
  params: Promise<{
    slug: string;
    lang: string;
  }>;
}

/**
 * Tenant layout - Sets the html lang attribute and provides TenantContext
 */
export default async function LangLayout({ children, params }: LangLayoutProps) {
  const { slug, lang } = await params;
  const locale = normalizeLocale(lang);

  // Check if request is proxied via Router (custom domain)
  const headersList = await headers();
  const isProxied = headersList.has("x-tenant-host");

  // DEBUG LOGGING
  if (process.env.NODE_ENV === "production") {
    console.log(`[capsule-Layout] slug=${slug} lang=${lang} isProxied=${isProxied}`);
    console.log(`[capsule-Layout] x-tenant-host: ${headersList.get("x-tenant-host")}`);
    console.log(`[capsule-Layout] host: ${headersList.get("host")}`);
  }

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground antialiased">
        <TenantProvider slug={slug} lang={lang as SupportedLang} isProxied={isProxied}>
          {children}
        </TenantProvider>
      </body>
    </html>
  );
}

/**
 * Generate static params for supported languages
 */
export function generateStaticParams() {
  return [{ lang: "es" }, { lang: "en" }];
}
