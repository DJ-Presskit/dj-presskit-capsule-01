"use client";

import { cn } from "@/lib/cn";
import { Text } from "./Text";
import { useI18n } from "@/core/i18n";

interface OutlineTextProps {
  title: string;
  outlineTitle: string;
  containerClassName?: string;
  topOffset?: string;
}

export const OutlineTitle: React.FC<OutlineTextProps> = ({
  title,
  outlineTitle,
  containerClassName,
  topOffset = "-top-[40%]",
}) => {
  const { t } = useI18n();

  return (
    <div
      className={cn(
        "flex items-center flex-col justify-center relative md:items-start md:text-left!",
        containerClassName,
      )}
    >
      <Text variant="title">{title.includes(".") ? t(title) : title}</Text>
      <Text variant="titleOutline" className={cn("absolute md:left-0", topOffset)}>
        {outlineTitle.includes(".") ? t(outlineTitle) : outlineTitle}
      </Text>
    </div>
  );
};
