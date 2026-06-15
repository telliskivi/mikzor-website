## Context

Greenfield personal site for an architect/creator in Tallinn. The site must work as both an **archive feed** (newest-first, "everything visible") and a **categorized portfolio**, with adding content reduced to "drop a Markdown file + images in a folder, `git push`."

Hard constraints driving the design:

- **Astro, static output only.** `npm run build` must produce a plain `dist/` of HTML/CSS/JS — no SSR, no edge functions, no runtime database.
- **Cloudflare Pages**, framework preset *Astro*, build command `npm run build`, output `dist`, Node 20+. No env vars, no backend.
- **Near-zero JavaScript.** Islands only where genuinely interactive (live clock, lightbox).
- **Content lives in the repo** as Markdown/MDX under `src/content/posts/`, validated by a Zod frontmatter schema. No CMS.

Stakeholders: the owner (sole author/maintainer); future readers of the site; the owner's future self when bumping Astro versions or adding a category.

## Goals / Non-Goals

**Goals:**

- Authoring workflow that's truly drop-a-folder simple: one `index.md` per post, images sit next to it, optimized automatically by Astro.
- A single place to edit when adding a new category (the Zod enum + a label map), with category routes generated automatically.
- Minimal, typographic, image-forward aesthetic that holds up on phone and desktop without bespoke per-page styling.
- Fast, accessible static output: real semantic HTML, keyboard-navigable, `alt` text required, Lighthouse-friendly out of the box.
- Easy local dev (`npm install && npm run dev`) and zero-config Cloudflare Pages deploy.

**Non-Goals:**

- No SSR, no serverless/edge functions, no runtime DB, no auth, no comments, no cart.
- No CMS or headless service integration.
- No analytics platform integration in this change (a single privacy-friendly script tag can be added later).
- No bespoke design tokens framework (Tailwind, vanilla-extract, etc.) — plain CSS with CSS custom properties is enough at this size.
- No full-text search, no pagination, no infinite scroll in v1.

## Decisions

### 1. Astro (latest stable) with `output: 'static'`

**Decision**: Use Astro for the entire site, with `output: 'static'` set explicitly in `astro.config.mjs`.

**Why**: Astro is purpose-built for content-heavy static sites, has first-class Content Collections with Zod validation, an image pipeline (`astro:assets`) that fits "drop a file next to the markdown," and Cloudflare Pages has a documented preset.

**Alternatives**:
- *Eleventy* — excellent SSG but the image pipeline and TypeScript story are less integrated; we'd hand-roll more.
- *Next.js static export* — heavier runtime, more JS by default, more friction for "zero JS" goal.
- *Hand-rolled Vite + Markdown* — re-implements Content Collections badly.

### 2. Single `posts` Content Collection with folder-per-post

**Decision**: One collection at `src/content/posts/`, where each post is a folder containing `index.md` and any sibling assets. Define the schema in `src/content/config.ts` using Zod.

```
src/content/posts/2024-funkfest/
  index.md
  cover.jpg
  gallery-1.jpg
```

**Why**: Astro's collection loader treats `index.md` inside a subfolder as a single entry whose slug is the folder name, and relative image references in frontmatter (`cover: ./cover.jpg`) get piped through `image()` and `sharp` for optimized output. This is the simplest "drop and push" authoring story without a CMS.

**Alternatives**:
- *Flat files under `posts/`* — forces images into `public/` or a separate assets folder; breaks colocation.
- *Multiple collections (e.g. one per category)* — duplicates schema and routing; categories are better expressed as a frontmatter enum.

### 3. Frontmatter schema (Zod)

```ts
const posts = defineCollection({
  type: 'content',
  schema: ({ image }) => z.object({
    title: z.string(),
    date: z.coerce.date(),
    category: z.enum(CATEGORIES),  // imported from a single source of truth
    tags: z.array(z.string()).default([]),
    cover: image().optional(),
    draft: z.boolean().default(false),
  }),
});
```

`CATEGORIES` is exported from `src/lib/categories.ts` as a `readonly` tuple plus a `LABELS` map (ET/EN). The Zod enum, the static route generator, and the category-page UI all import from this one module. Adding a category = append to the tuple + add a label entry.

**Why**: Single source of truth keeps "add a category" a one-file change. `z.coerce.date()` accepts both `2024-08-12` and full ISO strings in frontmatter. `image()` from the collection schema is what unlocks `astro:assets` optimization for the cover.

### 4. Routes via `getStaticPaths`

| Route | Source |
|---|---|
| `/` | `src/pages/index.astro` — `getCollection('posts')`, filter drafts in prod, sort by `date` desc. |
| `/[category]/` | `src/pages/[category]/index.astro` — `getStaticPaths` iterates `CATEGORIES`, returns posts filtered by that category. |
| `/posts/[...slug]/` | `src/pages/posts/[...slug].astro` — `getStaticPaths` returns one entry per post. |
| `/about/`, `/contact/`, `/404.astro` | Plain `.astro` pages. |
| `/feed.xml` | `src/pages/feed.xml.js` using `@astrojs/rss`. |

Drafts are excluded in production via `import.meta.env.PROD`.

**Why over file-system slugs**: `getStaticPaths` with `[...slug]` covers nested folder names cleanly, and gives us a single place to apply the draft filter and sort order.

### 5. Styling — vanilla CSS with custom properties, no framework

One global stylesheet (`src/styles/global.css`) sets:
- a small set of CSS custom properties (`--bg`, `--fg`, `--muted`, `--accent`, `--font-sans`, `--font-mono`, type scale, spacing scale);
- a `@media (prefers-color-scheme: dark)` block that overrides the palette tokens;
- baseline resets, focus-visible styles, and the grid/feed primitives.

Per-component styles use Astro's scoped `<style>` blocks.

**Why**: At this size, a framework (Tailwind, Open Props, etc.) is overhead. Custom properties give us theming, dark mode, and a single edit surface for the palette.

### 6. Interactive islands (the only two)

- **`<TallinnClock client:load />`** — a `.astro` component with a small inline `<script>` (or a `.ts` island) that updates a `<time>` element each second using `Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Tallinn', ... })`. SSR'd initial value avoids layout shift.
- **`<Lightbox client:idle />`** — a vanilla-JS island wired up to `<a data-lightbox>` links inside post bodies. Opens an overlay with the full-resolution image; closes on Escape / backdrop click; arrow-key navigation across sibling images.

No other component uses `client:*`. The feed, category pages, RSS, and post views all render as static HTML.

**Why `client:idle` for the lightbox**: It only matters once the user starts interacting with images; deferring keeps the homepage TBT low.

### 7. Head / meta strategy

A single `<Head>` component takes `{ title, description, image?, type? }` and emits:
- `<title>`, `<meta name="description">`;
- OpenGraph (`og:title`, `og:description`, `og:image`, `og:type`, `og:url`);
- Twitter card (`summary_large_image`);
- `<link rel="canonical">`, `<link rel="icon">`, `<link rel="alternate" type="application/rss+xml">`.

For posts, `image` falls back to the post's `cover` (when present). Site URL comes from `astro.config.mjs` `site` field.

### 8. Bilingual labels

`src/lib/categories.ts` exports:

```ts
export const CATEGORIES = ['arch','chair','hotel','funkfest','zine','mot','foto','video','art','music','coffee','other'] as const;
export const LABELS: Record<Category, { et: string; en: string }> = {
  arch:     { et: 'arhitektuur', en: 'architecture' },
  foto:     { et: 'foto',        en: 'photo' },
  music:    { et: 'muusika',     en: 'music' },
  art:      { et: 'kunst',       en: 'art' },
  // ...
};
```

UI renders `et / en` together (e.g. `foto / photo`) wherever the label appears.

### 9. Deployment & CI

- `astro.config.mjs` declares `site: 'https://example.tld'` (placeholder, owner updates), `output: 'static'`, integrations: `@astrojs/mdx`, `@astrojs/rss` (peer), `@astrojs/sitemap`.
- Cloudflare Pages: framework preset *Astro*, build command `npm run build`, output `dist`, Node version `20` (set via `.nvmrc` or Pages env). No environment variables.
- No GitHub Actions yet — Cloudflare Pages pulls from git and builds itself.

### 10. Repository layout

```
.
├── astro.config.mjs
├── package.json
├── tsconfig.json
├── .nvmrc                  # 20
├── .gitignore
├── README.md
├── public/                 # favicon, og fallback image, robots.txt
├── src/
│   ├── components/         # FeedItem, Header, Footer, Head, TallinnClock, Lightbox, PostMeta
│   ├── content/
│   │   ├── config.ts       # collection schema (Zod)
│   │   └── posts/<slug>/index.md
│   ├── layouts/            # BaseLayout, PostLayout
│   ├── lib/                # categories.ts, date.ts, site.ts
│   ├── pages/
│   │   ├── index.astro
│   │   ├── 404.astro
│   │   ├── about.astro
│   │   ├── contact.astro
│   │   ├── feed.xml.js
│   │   ├── [category]/index.astro
│   │   └── posts/[...slug].astro
│   └── styles/global.css
```

## Risks / Trade-offs

- **[Risk]** Adding a new category requires editing two places (`CATEGORIES` tuple and `LABELS` map) — Zod's `z.enum` can't be derived from an object literal without losing the literal types.
  **Mitigation**: A TS test/assertion (or a runtime check during build) verifies every `CATEGORIES` entry has a `LABELS` entry — fails the build loudly if you forget.

- **[Risk]** Astro's image pipeline rebuilds all referenced images on every build, which can be slow on Cloudflare Pages once the archive grows.
  **Mitigation**: Acceptable at archive sizes <~200 posts. If it bites, revisit by storing already-optimized variants in `public/` for old posts, or moving to remote images.

- **[Risk]** Live Tallinn clock SSR/CSR mismatch can flash an incorrect time (e.g. visitor in a different TZ briefly sees their local clock).
  **Mitigation**: Render the initial time server-side using the same `Intl.DateTimeFormat` configuration; the island just keeps updating. If hydration mismatch is still visible, render an empty `<time>` and let the client fill it on first tick.

- **[Risk]** Drafts could accidentally ship if filtering is only applied on the homepage.
  **Mitigation**: Apply the `draft` filter inside a single helper (`getPublishedPosts()`) that every route uses; never call `getCollection('posts')` directly from a page.

- **[Trade-off]** No tag pages in v1 — only category pages. Tags exist in frontmatter and can be displayed on posts, but tag-indexed routes are deferred to keep scope tight. The schema supports tags from day one, so adding tag routes later is non-breaking.

- **[Trade-off]** Vanilla CSS over a framework means slightly more typing for layout primitives, but avoids a build-tool dependency and keeps the JS payload at zero on non-island pages.

- **[Trade-off]** No pagination on the feed — at archive scale (<~500 posts) a single long feed loads fine; revisit if it stops being true.

## Migration Plan

Greenfield — no migration. Deployment steps for the owner:

1. `npm install && npm run dev` — verify locally.
2. Push the repo to GitHub (or any git host Cloudflare Pages supports).
3. In Cloudflare Pages dashboard: *Create project → Connect to Git → select repo*. Preset: *Astro*. Build command: `npm run build`. Output: `dist`. Node version: `20`.
4. First deploy runs; subsequent `git push` triggers automatic redeploys.

Rollback = revert the offending commit; Cloudflare Pages keeps a history of previous deploys and supports one-click rollback in the dashboard.

## Open Questions

- **Domain**: What hostname will be in `astro.config.mjs` `site:`? Default to a placeholder (`https://example.tld`) and let the owner edit before the first real deploy.
- **Fonts**: Self-host a grotesk (e.g. Inter) and a mono (e.g. JetBrains Mono) under `public/fonts/`, or rely on system stacks (`ui-sans-serif`, `ui-monospace`)? Default to system stacks for v1 to avoid layout shift and licensing overhead; revisit later.
- **Contact page content**: Email-only, or include socials? Default to email + a couple of placeholder social links the owner can edit.
- **Estonian copy on About/Contact**: Provide ET/EN side-by-side, or English only with bilingual category labels? Default to English-only body copy + bilingual category labels per the brief, leaving room for the owner to add ET later.
