// Site-wide metadata used by <Head>, RSS, sitemap, OG tags.
// Edit these strings to brand the site.

export const SITE = {
  title: 'mikael ristmets',
  tagline: 'archive · portfolio',
  description:
    'an archive feed and portfolio of work by mikael ristmets — architecture, photo, music, zine, and more.',
  author: 'mikael ristmets',
  locale: 'en',
  // OG fallback lives in /public, referenced by absolute path.
  ogFallback: '/og-default.png',
} as const;
