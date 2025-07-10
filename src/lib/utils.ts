import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getPriceColorClass(price: string | undefined | null): string {
  if (!price) return '';
  const trimmed = price.trim();
  if (trimmed.toLowerCase() === 'sold') return 'text-rose-600';
  if (trimmed.startsWith('$')) return 'text-green-700 text-base';
  return 'text-indigo-500 text-base';
}
