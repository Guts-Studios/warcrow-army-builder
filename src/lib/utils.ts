import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat().format(num);
}

export function truncateText(text: string, maxLength: number): string {
  if (!text) return '';
  return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
}

export function getScrollAreaHeight(isCompact: boolean = false, itemCount: number = 0): string {
  if (isCompact) {
    return "max-h-[400px]";
  }
  
  // Adjust height based on item count, but keep within reasonable limits
  const baseHeight = 600;
  const adjustedHeight = Math.min(baseHeight, Math.max(300, itemCount * 100));
  
  return `max-h-[${adjustedHeight}px]`;
}
