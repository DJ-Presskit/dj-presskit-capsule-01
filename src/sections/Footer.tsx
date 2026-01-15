"use client";
/**
 * Footer Section - Empty Shell
 * TODO: Connect to presskit data
 */

import { PresskitLogo } from "@/components/media";
import { usePresskit } from "@/context";
import { AnimatedSeparator, Text } from "@/components/ui";
import { SocialLinks } from "@/components/nav";
import LandingBanner from "@/core/components/LandingBanner";
import { useI18n } from "@/core/i18n";
import { BackgroundRenderer } from "@/core/background";

export function Footer() {
  const { presskit } = usePresskit();
  const { t } = useI18n();

  return (
    <footer id="footer" className="pt-10  relative overflow-hidden">
      <AnimatedSeparator className="absolute top-0 inset-0" />
      <section className=" section-px max-w-[1500px] min-[2500px]:max-w-[1800px] mx-auto flex flex-col gap-10 items-center justify-center">
        <PresskitLogo
          logo={presskit?.media?.logo}
          artistName={presskit.artistName}
          size="sm"
          objectPosition="center"
        />
        <SocialLinks channels={presskit?.contact?.channels} />
        <Text variant="custom" className="text-sm text-center!">
          © {t("footer.copyright")} {new Date().getFullYear()} -{" "}
          {presskit?.artistName.toUpperCase()} - DJ PRESSKIT ® - {t("footer.allRightsReserved")}.
        </Text>
        <LandingBanner />
      </section>
      <div className="absolute inset-0 rotate-180 translate-y-[60%] -z-10">
        <BackgroundRenderer theme={presskit.theme} />
      </div>
    </footer>
  );
}

export default Footer;
