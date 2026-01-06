import NextLink from "next/link";
import { cn } from "@/lib/cn";
import type { ComponentPropsWithoutRef } from "react";

interface LinkProps
  extends Omit<ComponentPropsWithoutRef<typeof NextLink>, "className"> {
  className?: string;
  variant?: "default" | "muted" | "accent";
}

const variantClasses = {
  default: "text-foreground hover:text-accent transition-colors",
  muted: "text-muted-foreground hover:text-foreground transition-colors",
  accent: "text-accent hover:text-accent/80 transition-colors",
};

/**
 * Link - next/link wrapper with styling
 */
export function Link({ className, variant = "default", ...props }: LinkProps) {
  return (
    <NextLink
      className={cn(
        "underline-offset-4 hover:underline",
        variantClasses[variant],
        className
      )}
      {...props}
    />
  );
}
