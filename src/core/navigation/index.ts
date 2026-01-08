export * from "./sections";
export { SectionScroller } from "./SectionScroller";

import { useTenant } from "../tenant-context";
import { buildSectionPath, type SectionKey } from "./sections";

/**
 * Hook to build section paths using the current tenant context
 * (Automatically handles isProxied vs technical URLs)
 */
export function useSectionPath() {
  const { slug, lang, isProxied } = useTenant();

  return (section?: SectionKey) => {
    return buildSectionPath({
      slug,
      lang,
      section,
      isProxied,
    });
  };
}
