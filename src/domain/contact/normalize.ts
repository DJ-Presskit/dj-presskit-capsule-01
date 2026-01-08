/**
 * Contact Section Normalizer
 */

import type { ContactVM } from "../types";
import { trimString, safeUrl } from "../validators";

interface ContactDTO {
  contact?: {
    primaryEmail?: string;
    primaryWhatsapp?: string;
  };
  driveUrl?: string;
}

export function normalizeContact(dto: ContactDTO | null | undefined): ContactVM {
  const contact = dto?.contact;

  const email = trimString(contact?.primaryEmail);
  const whatsapp = trimString(contact?.primaryWhatsapp);
  const driveUrl = safeUrl(dto?.driveUrl);

  return {
    email,
    whatsapp,
    driveUrl,
    hasContact: Boolean(email || whatsapp || driveUrl),
  };
}
