/**
 * Social Links Section Normalizer
 */

import type { SocialsVM, SocialLinkVM } from "../types";
import { trimString, safeUrl, generateStableKey, dedupeById } from "../validators";

interface ChannelDTO {
  platform?: string;
  url?: string;
  iconUrl?: string;
}

interface SocialsDTO {
  contact?: {
    primaryEmail?: string;
    primaryWhatsapp?: string;
    channels?: ChannelDTO[];
  };
}

function normalizeSocialLink(dto: ChannelDTO, index: number): SocialLinkVM | null {
  const platform = trimString(dto.platform);
  const url = safeUrl(dto.url);

  if (!platform || !url) return null;

  return {
    id: generateStableKey({ id: `${platform}-${index}` }, index),
    platform,
    url,
    iconUrl: safeUrl(dto.iconUrl),
  };
}

export function normalizeSocials(dto: SocialsDTO | null | undefined): SocialsVM {
  const contact = dto?.contact;
  const channelsRaw = Array.isArray(contact?.channels) ? contact.channels : [];

  const links = channelsRaw
    .map((ch, i) => normalizeSocialLink(ch, i))
    .filter((link): link is SocialLinkVM => link !== null);

  const uniqueLinks = dedupeById(links);

  const primaryEmail = trimString(contact?.primaryEmail);
  const primaryWhatsapp = trimString(contact?.primaryWhatsapp);

  return {
    links: uniqueLinks,
    primaryEmail,
    primaryWhatsapp,
    hasLinks: uniqueLinks.length > 0,
    hasContact: Boolean(primaryEmail || primaryWhatsapp),
  };
}
