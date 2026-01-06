import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility for merging Tailwind classes with clsx
 * Handles conflicts and conditional classes
 * 
 * @example
 * cn("px-4 py-2", isActive && "bg-accent", className)
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
