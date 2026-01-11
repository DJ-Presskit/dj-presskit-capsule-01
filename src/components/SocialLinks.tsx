"use client";

/**
 * SocialLinks Component
 *
 * Social media icons row with inline SVG icons.
 * Pulls URLs from presskit.contact.channels.
 * Features subtle glitch hover effect.
 */

import { clsx } from "clsx";
import Link from "next/link";
import Icon from "./ui/Icon";
import { twMerge } from "tailwind-merge";

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
}

export function SocialLinks({ channels = [] }: SocialLinksProps) {
  return (
    <div className={clsx("flex items-center gap-5 mix-blend-difference z-10")}>
      {channels.map(({ platform, url, iconUrl }) => {
        return (
          <Link
            key={url}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={platform}
            className="size-7 transition hover:opacity-75"
          >
            <Icon src={iconUrl!} className={twMerge("text-white w-full h-full")} />
          </Link>
        );
      })}
    </div>
  );
}

export default SocialLinks;
