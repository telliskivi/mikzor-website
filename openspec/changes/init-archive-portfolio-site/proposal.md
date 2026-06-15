## Why

A Tallinn-based architect/creator needs a personal website that doubles as a public archive of their work — a newest-first feed on the homepage, browsable by category, with a minimal typographic feel. It must be free to host, trivial to update (drop a Markdown file + images, `git push`), and survive without a backend, CMS, or runtime services. A fully static Astro site deployed to Cloudflare Pages hits all of these constraints at once.

## What Changes

- Bootstrap a new Astro project (latest stable) configured for static output (`output: 'static'`) — no SSR, no serverless functions, no runtime APIs.
- Define a single Astro Content Collection `posts` (`src/content/posts/`) with a Zod-typed frontmatter schema: `title`, `date`, `category` (enum), `tags?`, `cover?` (image), `draft?`.
- Use folder-per-post layout so each post's images live next to its `index.md` and are referenced relatively, optimized through Astro's image pipeline.
- Add routes: `/` (newest-first feed), `/[category]/` (category-filtered feed, statically generated from the enum), `/posts/[slug]/` (single post view), `/about/`, `/contact/`, `/feed.xml` (RSS), and a styled `404`.
- Ship a minimal typographic design system — near-black on off-white, lowercase grotesk/mono, generous whitespace, image-led grid — implemented in vanilla CSS with `prefers-color-scheme` light/dark support.
- Add two tiny client islands: a live `Europe/Tallinn` clock in the header and a vanilla-JS lightbox for gallery images. Everything else ships zero JS.
- Add bilingual ET/EN category labels (`foto/photo`, `muusika/music`, `kunst/art`, …) defined once in a single shared module.
- Configure OpenGraph/Twitter meta tags, favicon, and per-post share images (falling back to the cover) via a reusable `<Head>` component.
- Seed the repo with 4–6 example posts across different categories so the feed, category pages, and single-post view work out of the box.
- Add a `README.md` covering local dev, the copy-paste frontmatter template, how to add a category, and the exact Cloudflare Pages settings (preset *Astro*, build command `npm run build`, output `dist`, Node 20+).

## Capabilities

### New Capabilities
- `site-foundation`: Astro project bootstrap, static-output config, Cloudflare Pages deployment contract, README/workflow for adding content.
- `content-model`: The `posts` content collection — frontmatter schema, folder-per-post convention, category enum, draft handling, image pipeline.
- `feed-and-routes`: Homepage feed, per-category feeds, single post view, about/contact, RSS feed, 404 page, and how posts flow into each route.
- `design-system`: Typography, palette, layout primitives, responsive rules, accessibility baseline, light/dark theme, OG/Twitter meta and favicon.
- `interactive-islands`: The two permitted client-side islands — live Tallinn clock and gallery lightbox — and the rule that nothing else ships JS.

### Modified Capabilities
<!-- None — this is a greenfield project; no existing specs to modify. -->

## Impact

- **Code**: Greenfield. Creates `package.json`, `astro.config.mjs`, `tsconfig.json`, `src/`, `public/`, `.gitignore`, `README.md`, and seed content under `src/content/posts/`.
- **Dependencies**: `astro`, `@astrojs/mdx`, `@astrojs/rss`, `@astrojs/sitemap`, `sharp` (image pipeline), `typescript`. Dev only — no runtime deps.
- **Deployment**: Cloudflare Pages, framework preset *Astro*, build command `npm run build`, output `dist`, Node 20+. No environment variables, no backend, no edge functions.
- **Out of scope**: e-commerce, auth, comments, server-side analytics, CMS integrations. Tag filtering on the feed and lightbox are in scope as "nice-to-haves only if they keep JS small and don't break static export."
