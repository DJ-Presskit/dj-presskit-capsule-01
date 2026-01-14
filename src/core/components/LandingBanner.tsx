"use client";
import { ExternalLink } from "lucide-react";
import { useI18n } from "../i18n";
import { Text } from "@/components/ui";
import Link from "next/link";

export default function LandingBanner() {
  const { locale } = useI18n();

  return (
    <div className="relative flex flex-col items-center justify-center h-[100px]">
      <div className="flex items-center justify-center md:justify-start gap-2 w-full section-max-w mx-auto section-px">
        <Text
          variant="custom"
          className="text-xs! whitespace-nowrap text-transparent bg-clip-text bg-linear-to-tl from-gray-200 to-neutral-600"
        >
          POWERED BY
        </Text>
        <Text
          variant="custom"
          className="!text-xs whitespace-nowrap !text-[#59c6ba] font-bold hover:opacity-50 transition duration-500"
        >
          <Link href={`https://dj-presskit.com/${locale}`} className="flex items-center gap-2">
            DJ PRESSKIT
            <ExternalLink size={15} />
          </Link>
        </Text>
      </div>
    </div>
  );
}
