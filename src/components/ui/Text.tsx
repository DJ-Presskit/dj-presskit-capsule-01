import { cn } from "@/lib/cn";

interface TextProps {
  children: React.ReactNode;
  className?: string;
  variant?: "body" | "caption" | "muted" | "lead";
  as?: "p" | "span" | "div";
}

const variantClasses = {
  body: "text-base text-foreground",
  caption: "text-sm text-muted-foreground",
  muted: "text-base text-muted-foreground",
  lead: "text-lg md:text-xl text-foreground/90",
};

/**
 * Text - Typography component with variants
 */
export function Text({
  children,
  className,
  variant = "body",
  as: Component = "p",
}: TextProps) {
  return (
    <Component className={cn(variantClasses[variant], className)}>
      {children}
    </Component>
  );
}
