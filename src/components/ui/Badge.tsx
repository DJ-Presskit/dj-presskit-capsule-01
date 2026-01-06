import { cn } from "@/lib/cn";

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "accent" | "muted" | "outline";
}

const variantClasses = {
  default: "bg-white/10 text-white",
  accent: "bg-accent/20 text-accent",
  muted: "bg-muted text-muted-foreground",
  outline: "bg-transparent border border-white/20 text-white",
};

/**
 * Badge - Status/category indicator
 */
export function Badge({
  children,
  className,
  variant = "default",
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        variantClasses[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
