import { cn } from "@/lib/cn";

type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

interface HeadingProps {
  children: React.ReactNode;
  className?: string;
  level?: HeadingLevel;
  as?: `h${HeadingLevel}`;
}

const levelClasses: Record<HeadingLevel, string> = {
  1: "text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight",
  2: "text-3xl md:text-4xl font-bold tracking-tight",
  3: "text-2xl md:text-3xl font-semibold",
  4: "text-xl md:text-2xl font-semibold",
  5: "text-lg md:text-xl font-medium",
  6: "text-base md:text-lg font-medium",
};

/**
 * Heading - Responsive headings h1-h6
 */
export function Heading({ children, className, level = 2, as }: HeadingProps) {
  const Component = as || (`h${level}` as `h${HeadingLevel}`);

  return (
    <Component
      className={cn("text-foreground", levelClasses[level], className)}
    >
      {children}
    </Component>
  );
}
