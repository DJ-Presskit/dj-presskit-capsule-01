import { cn } from "@/lib/cn";

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

/**
 * Section - Semantic section with vertical spacing
 */
export function Section({ children, className, id }: SectionProps) {
  return (
    <section id={id} className={cn("py-16 md:py-24", className)}>
      {children}
    </section>
  );
}
