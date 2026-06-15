// Site-wide metadata used by <Head>, RSS, sitemap, OG tags.
// Edit these strings to brand the site.

export const SITE = {
  title: 'mikael ristmets',
  tagline: 'archive · portfolio',
  description:
    'archive and portfolio of mikael ristmets — architecture, furniture, installations, zine, photography, video, art, music, coffee.',
  author: 'mikael ristmets',
  locale: 'en',
  // OG fallback lives in /public, referenced by absolute path.
  ogFallback: '/og-default.png',
} as const;
