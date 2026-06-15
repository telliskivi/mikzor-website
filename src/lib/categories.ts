// Single source of truth for site categories.
// To add a new category: append to CATEGORIES and add a matching LABELS entry.
// Both the Zod schema (src/content/config.ts) and the static [category] route
// derive from CATEGORIES, so no other file needs to be touched.

export const CATEGORIES = [
  'writing',
  'work',
  'exhibitions',
  'photography',
  'music',
  'coffee',
] as const;

export type Category = (typeof CATEGORIES)[number];

type Label = { et: string; en: string };

// `satisfies` ensures every Category has a label — missing one is a compile error.
export const LABELS = {
  writing:     { et: 'kirjutamine', en: 'writing' },
  work:        { et: 'töö',         en: 'work' },
  exhibitions: { et: 'näitused',    en: 'exhibitions' },
  photography: { et: 'foto',        en: 'photography' },
  music:       { et: 'muusika',     en: 'music' },
  coffee:      { et: 'kohv',        en: 'coffee' },
} as const satisfies Record<Category, Label>;

export function formatCategory(c: Category): string {
  const { et, en } = LABELS[c];
  return `${et} / ${en}`;
}

export function isCategory(value: string): value is Category {
  return (CATEGORIES as readonly string[]).includes(value);
}
