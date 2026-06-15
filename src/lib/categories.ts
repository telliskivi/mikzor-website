// Single source of truth for site categories.
// Matches the sections on mikaelristmets.com.
// To add a new category: append to CATEGORIES and add a matching LABELS entry.

export const CATEGORIES = [
  'chair',
  'hotel',
  'funkfest',
  'ehe',
  'zine',
  'mot',
  'foto',
  'video',
  'kunst',
  'music',
  'coffee',
] as const;

export type Category = (typeof CATEGORIES)[number];

type Label = { et: string; en: string };

export const LABELS = {
  chair:    { et: 'tool',                en: 'chair' },
  hotel:    { et: 'hotell',              en: 'hotel' },
  funkfest: { et: 'funkfest',            en: 'funkfest' },
  ehe:      { et: 'errare humanum est',  en: 'ehe' },
  zine:     { et: 'zine',                en: 'zine' },
  mot:      { et: 'tüv',                 en: 'mot' },
  foto:     { et: 'foto',                en: 'photo' },
  video:    { et: 'video',               en: 'video' },
  kunst:    { et: 'kunst',               en: 'art' },
  music:    { et: 'muusika',             en: 'music' },
  coffee:   { et: 'coffee',              en: 'coffee' },
} as const satisfies Record<Category, Label>;

export function formatCategory(c: Category): string {
  const { et, en } = LABELS[c];
  return `${et}/${en}`;
}

export function isCategory(value: string): value is Category {
  return (CATEGORIES as readonly string[]).includes(value);
}
