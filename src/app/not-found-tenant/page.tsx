import type { Metadata } from "next";
import { buildIconsMetadata, buildOgImages, DEFAULT_METADATA } from "@/core/seo";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Presskit Not Found | DJ Presskit",
  description: "The requested presskit could not be found.",
  robots: "noindex, nofollow",
  icons: buildIconsMetadata(null),
  openGraph: {
    title: "Presskit Not Found | DJ Presskit",
    description: "The requested presskit could not be found.",
    images: buildOgImages({ alt: "DJ Presskit - Not Found" }),
    type: "website",
    siteName: DEFAULT_METADATA.siteName,
  },
  twitter: {
    card: "summary",
    title: "Presskit Not Found | DJ Presskit",
    description: "The requested presskit could not be found.",
  },
};

/**
 * 404-like page for unknown tenants
 * Displayed when host/slug resolution fails
 */
export default function NotFoundTenantPage() {
  if (process.env.NODE_ENV === "development") {
    redirect("/t/john-doe/es");
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-black">
      <h1 className="text-foreground uppercase text-4xl md:text-6xl lg:text-7xl tracking-[-4px] text-center">
        Presskit Not Found
      </h1>
    </main>
  );
}
