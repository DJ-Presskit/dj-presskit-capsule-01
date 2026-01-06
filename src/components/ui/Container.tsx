import { cn } from "@/lib/cn";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Container - Max-width wrapper with responsive padding
 */
export function Container({ children, className }: ContainerProps) {
  return <div className={cn("container-main", className)}>{children}</div>;
}
