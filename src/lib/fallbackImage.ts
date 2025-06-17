// src/lib/fallbackImage.ts

export function getSafeImageSrc(src?: string): string {
  if (!src || typeof src !== 'string' || !src.trim()) {
    return '/placeholder.svg';
  }
  return src.trim();
}