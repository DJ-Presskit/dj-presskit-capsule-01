import { normalizeLocale, type Locale } from "@/core/i18n";

interface LangLayoutProps {
  children: React.ReactNode;
  params: Promise<{
    slug: string;
    lang: string;
  }>;
}

/**
 * Tenant layout - Sets the html lang attribute based on route
 */
export default async function LangLayout({
  children,
  params,
}: LangLayoutProps) {
  const { lang } = await params;
  const locale = normalizeLocale(lang);

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground antialiased">
        {children}
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
