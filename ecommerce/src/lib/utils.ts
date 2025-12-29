import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// cn merges tailwind classes, keeping intentful overrides
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
