"use client";

/**
 * SocialLinks Component
 *
 * Social media icons row with inline SVG icons.
 * Pulls URLs from presskit.contact.channels.
 * Features subtle glitch hover effect.
 */

import { clsx } from "clsx";

// ============================================================================
// Types
// ============================================================================

interface Channel {
  platform: string;
  url: string;
  iconUrl?: string;
}

interface SocialLinksProps {
  /** Contact channels from API */
  channels?: Channel[];
  /** Primary email */
  email?: string;
  /** Primary WhatsApp */
  whatsapp?: string;
  /** Additional CSS classes */
  className?: string;
}

// ============================================================================
// Icon Components (Inline SVG)
// ============================================================================

const icons: Record<string, React.FC<{ className?: string }>> = {
  instagram: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  ),
  soundcloud: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M7 17.939h-1v-8.068c.308-.231.639-.429 1-.566v8.634zm3 0h1v-9.224c-.229.265-.443.548-.621.857l-.379-.184v8.551zm2 0h1.053v-8.879c-.195-.084-.378-.188-.559-.291l-.494.11v9.06zm2 0h1.022v-8.391c-.147.142-.307.271-.475.393l-.547.122v7.876zm2 0h1v-7.688c-.267.089-.534.199-.762.345l-.238.146v7.197zm2 0h1v-6.793c-.3.047-.59.128-.867.238l-.133.058v6.497zm2 0h1v-5.838c-.234.021-.472.083-.693.171l-.307.125v5.542zm16.879-4.189c-.203 0-.837.056-.873.08-.021-.115-.156-.371-.246-.601-.307-.787-.853-1.413-1.59-1.88-1.003-.636-2.273-.918-3.637-.721-.371.054-.629.112-.87.192v7.119h8.216c1.719 0 3.121-1.402 3.121-3.101 0-1.7-1.402-3.088-3.121-3.088zm-19.879-5.189c-.385 0-.753.049-1.116.127v9.251h3v-7.25c-.543-.759-1.144-1.361-1.884-2.128zm-2 3.432c-.124-.236-.26-.461-.405-.678v6.624h1l.179-5.599c-.27-.111-.541-.231-.774-.347z" />
    </svg>
  ),
  spotify: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm5.042 17.256c-.196.305-.603.396-.897.196-2.462-1.506-5.563-1.847-9.214-1.012-.352.08-.703-.14-.783-.492-.08-.353.14-.704.493-.784 3.996-.914 7.425-.52 10.199 1.171.294.2.386.607.202.921zm1.349-2.988c-.245.381-.756.5-1.138.256-2.818-1.733-7.113-2.236-10.445-1.223-.433.132-.891-.112-1.022-.545-.132-.434.111-.891.544-1.023 3.807-1.159 8.539-.598 11.798 1.395.382.244.501.756.263 1.14zm.118-3.119c-3.382-2.01-8.964-2.195-12.197-1.214-.518.157-1.065-.134-1.222-.651-.157-.518.133-1.065.651-1.222 3.708-1.127 9.876-.909 13.778 1.403.466.276.619.879.342 1.345-.274.465-.879.618-1.352.339z" />
    </svg>
  ),
  whatsapp: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
    </svg>
  ),
  email: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M0 3v18h24v-18h-24zm21.518 2l-9.518 7.713-9.518-7.713h19.036zm-19.518 14v-11.817l10 8.104 10-8.104v11.817h-20z" />
    </svg>
  ),
  twitter: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  ),
  youtube: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
    </svg>
  ),
  facebook: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
    </svg>
  ),
  tiktok: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
    </svg>
  ),
};

// Map platform names/URLs to icon keys
function getIconKey(platform: string, url: string): string | null {
  const p = platform.toLowerCase();
  const u = url.toLowerCase();

  if (p.includes("instagram") || u.includes("instagram")) return "instagram";
  if (p.includes("soundcloud") || u.includes("soundcloud")) return "soundcloud";
  if (p.includes("spotify") || u.includes("spotify")) return "spotify";
  if (p.includes("whatsapp") || u.includes("whatsapp") || u.includes("wa.me")) return "whatsapp";
  if (p.includes("twitter") || p.includes("x.com") || u.includes("twitter") || u.includes("x.com"))
    return "twitter";
  if (p.includes("youtube") || u.includes("youtube") || u.includes("youtu.be")) return "youtube";
  if (p.includes("facebook") || u.includes("facebook") || u.includes("fb.com")) return "facebook";
  if (p.includes("tiktok") || u.includes("tiktok")) return "tiktok";
  if (p.includes("email") || p.includes("mail") || u.includes("mailto:")) return "email";

  return null;
}

// ============================================================================
// Component
// ============================================================================

export function SocialLinks({ channels = [], email, whatsapp, className = "" }: SocialLinksProps) {
  // Build list of links to render
  const links: { url: string; icon: string; label: string }[] = [];

  // Add channels
  for (const channel of channels) {
    const iconKey = getIconKey(channel.platform, channel.url);
    if (iconKey && icons[iconKey]) {
      links.push({
        url: channel.url,
        icon: iconKey,
        label: channel.platform,
      });
    }
  }

  // Add email if not already in channels
  if (email && !links.some((l) => l.icon === "email")) {
    links.push({
      url: `mailto:${email}`,
      icon: "email",
      label: "Email",
    });
  }

  // Add WhatsApp if not already in channels
  if (whatsapp && !links.some((l) => l.icon === "whatsapp")) {
    // Format WhatsApp URL
    const cleanNumber = whatsapp.replace(/\D/g, "");
    links.push({
      url: `https://wa.me/${cleanNumber}`,
      icon: "whatsapp",
      label: "WhatsApp",
    });
  }

  if (links.length === 0) {
    return null;
  }

  return (
    <div className={clsx("flex items-center gap-2", className)}>
      {links.map((link) => {
        const IconComponent = icons[link.icon];
        return (
          <a
            key={link.url}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className={clsx(
              "group relative p-2 rounded-lg",
              "text-white/70 hover:text-white",
              "transition-colors duration-200",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-accent",
              "icon-glitch",
            )}
            aria-label={link.label}
          >
            <IconComponent className="w-5 h-5" />

            {/* Tooltip */}
            <span
              className={clsx(
                "absolute bottom-full left-1/2 -translate-x-1/2 mb-2",
                "px-2 py-1 rounded text-xs whitespace-nowrap",
                "bg-black/90 text-white",
                "opacity-0 group-hover:opacity-100 transition-opacity duration-200",
                "pointer-events-none",
              )}
            >
              {link.label}
            </span>
          </a>
        );
      })}
    </div>
  );
}

export default SocialLinks;
