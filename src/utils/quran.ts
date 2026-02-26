export const formatReference = (surahNumber: number, ayahNumber: number) =>
  `${surahNumber}:${ayahNumber}`;

export const normalizeKeyword = (value: string) => value.trim().replace(/\s+/g, " ");

export const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);
