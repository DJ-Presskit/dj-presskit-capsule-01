/**
 * SocialIcon - Platform icon display
 */

interface SocialIconProps {
  platform: string;
  url: string;
  iconUrl?: string | null;
  className?: string;
}

// Simple platform to icon mapping
const PLATFORM_ICONS: Record<string, string> = {
  instagram: "📷",
  facebook: "📘",
  twitter: "🐦",
  x: "𝕏",
  youtube: "🎬",
  spotify: "🎵",
  soundcloud: "☁️",
  tiktok: "🎵",
  twitch: "🎮",
  linkedin: "💼",
  website: "🌐",
  default: "🔗",
};

function getIcon(platform: string): string {
  const key = platform.toLowerCase();
  return PLATFORM_ICONS[key] || PLATFORM_ICONS.default;
}

export function SocialIcon({ platform, url, iconUrl, className = "" }: SocialIconProps) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      title={platform}
      className={`
        flex items-center justify-center
        w-12 h-12 rounded-xl
        bg-white/5 hover:bg-accent/20
        transition-all duration-200
        text-xl
        ${className}
      `}
    >
      {iconUrl ? (
        <img src={iconUrl} alt={platform} className="w-6 h-6 object-contain" />
      ) : (
        <span role="img" aria-label={platform}>
          {getIcon(platform)}
        </span>
      )}
    </a>
  );
}
