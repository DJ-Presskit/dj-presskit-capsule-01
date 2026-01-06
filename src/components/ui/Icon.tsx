import { cn } from "@/lib/cn";
import type { LucideIcon } from "lucide-react";

interface IconProps {
  icon: LucideIcon;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  label?: string;
}

const sizeClasses = {
  sm: "h-4 w-4",
  md: "h-5 w-5",
  lg: "h-6 w-6",
  xl: "h-8 w-8",
};

/**
 * Icon - lucide-react wrapper with consistent sizing
 */
export function Icon({
  icon: IconComponent,
  className,
  size = "md",
  label,
}: IconProps) {
  return (
    <IconComponent
      className={cn(sizeClasses[size], className)}
      aria-label={label}
      aria-hidden={!label}
    />
  );
}
