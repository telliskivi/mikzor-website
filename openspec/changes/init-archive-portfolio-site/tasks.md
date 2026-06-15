## 1. Project scaffold and tooling

- [x] 1.1 Initialize `package.json` with name, private:true, type:module, and scripts `dev` (`astro dev`), `build` (`astro build`), `preview` (`astro preview`), `astro` (`astro`)
- [x] 1.2 Add dependencies: `astro` (latest stable), `@astrojs/mdx`, `@astrojs/rss`, `@astrojs/sitemap`, `sharp`; devDependencies: `typescript`, `@types/node`
- [x] 1.3 Create `.nvmrc` pinning Node `20`
- [x] 1.4 Create `tsconfig.json` extending `astro/tsconfigs/strict`
- [x] 1.5 Create `astro.config.mjs` with `output: 'static'`, `site: 'https://example.tld'` placeholder, integrations `mdx()` and `sitemap()`, and image service defaults (sharp)
- [x] 1.6 Create `.gitignore` covering `node_modules`, `dist`, `.astro`, `.env*`, OS files
- [x] 1.7 Run `npm install` and verify `npm run dev` boots without errors

## 2. Categories module (single source of truth)

- [x] 2.1 Create `src/lib/categories.ts` exporting `CATEGORIES` as a `readonly` tuple of `['arch','chair','hotel','funkfest','zine','mot','foto','video','art','music','coffee','other']` and a `Category` type via `typeof CATEGORIES[number]`
- [x] 2.2 In the same module, export `LABELS: Record<Category, { et: string; en: string }>` with bilingual labels for every category
- [x] 2.3 Add a compile-time assertion (e.g. `satisfies Record<Category, …>`) so any missing label fails type-check
- [x] 2.4 Export a small helper `formatCategory(c: Category): string` returning `"${et} / ${en}"`

## 3. Content collection

- [x] 3.1 Create `src/content/config.ts` defining the `posts` collection with Zod schema: `title` (string), `date` (`z.coerce.date()`), `category` (`z.enum(CATEGORIES)`), `tags` (`z.array(z.string()).default([])`), `cover` (`image().optional()`), `draft` (`z.boolean().default(false)`)
- [x] 3.2 Create `src/lib/posts.ts` exporting `getPublishedPosts()` that calls `getCollection('posts')` and filters drafts when `import.meta.env.PROD`, then sorts by `date` descending
- [x] 3.3 Create `src/lib/posts.ts` helper `getPostsByCategory(category)` that wraps `getPublishedPosts()` and filters by `data.category`

## 4. Layouts, head, and global styling

- [x] 4.1 Create `src/styles/global.css` with CSS custom properties for light palette (off-white bg, near-black fg, one accent), type scale, spacing scale, and a `@media (prefers-color-scheme: dark)` block overriding palette tokens
- [x] 4.2 Add baseline resets, `:focus-visible` styles, and a `.sr-only` utility in `global.css`
- [x] 4.3 Create `src/components/Head.astro` accepting `{ title, description, image?, type? }` and emitting `<title>`, `meta description`, OpenGraph tags, Twitter card tags, `<link rel="canonical">`, favicon link, and `<link rel="alternate" type="application/rss+xml" href="/feed.xml">`
- [x] 4.4 Create `public/favicon.svg` (or `.ico`) and `public/og-default.png` fallback OG image; reference them from `<Head>`
- [x] 4.5 Create `src/components/Header.astro` rendering site title/wordmark, primary nav (home + each category, using bilingual labels), and the `<TallinnClock />` island
- [x] 4.6 Create `src/components/Footer.astro` with a minimal footer (copyright, RSS link)
- [x] 4.7 Create `src/layouts/BaseLayout.astro` that wraps content with `<html lang="en">`, `<Head>`, skip-to-content link, `<Header />`, `<main id="main">`, and `<Footer />`
- [x] 4.8 Create `src/layouts/PostLayout.astro` extending `BaseLayout` with article-specific structure (title, date, bilingual category, tags, content slot)

## 5. Interactive islands

- [x] 5.1 Create `src/components/TallinnClock.astro` that renders an initial server-side time via `Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Tallinn', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })` inside a `<time>` element, and includes an inline `<script>` updating it every second using the same formatter; mount via `client:load`
- [x] 5.2 Create `src/components/Lightbox.astro` as a vanilla-JS island (mounted `client:idle`) that wires up click handlers on `a[data-lightbox]` to open a `<dialog>`-based overlay with the full-resolution image, closes on Escape/backdrop click, and supports arrow-key navigation across siblings sharing the same `data-gallery` value
- [x] 5.3 Ensure both islands degrade cleanly when JS is disabled (clock shows static initial value, lightbox links behave as normal image links)

## 6. Feed item and routes

- [x] 6.1 Create `src/components/FeedItem.astro` taking a post entry and rendering cover (via `<Image>`), title, formatted date, and bilingual category label, wrapped in a link to `/posts/<slug>/`
- [x] 6.2 Create `src/pages/index.astro` rendering the homepage feed: short header line `newest first • everything visible • click for single view`, then a list/grid of `<FeedItem>` for `getPublishedPosts()`
- [x] 6.3 Create `src/pages/[category]/index.astro` with `getStaticPaths()` iterating `CATEGORIES`; each page renders the bilingual category heading and a feed of posts in that category (or an empty-state message)
- [x] 6.4 Create `src/pages/posts/[...slug].astro` with `getStaticPaths()` from `getPublishedPosts()`; renders the post via `PostLayout` and uses the post body via Astro's content `render()` API
- [x] 6.5 Create `src/pages/about.astro` and `src/pages/contact.astro` as simple static pages using `BaseLayout`
- [x] 6.6 Create `src/pages/404.astro` using `BaseLayout`, with a short message and a link back to `/`
- [x] 6.7 Create `src/pages/feed.xml.js` using `@astrojs/rss` to emit RSS 2.0 from `getPublishedPosts()` (title, link, pubDate, description/excerpt)

## 7. Seed content

- [x] 7.1 Create `src/content/posts/2025-arch-pavilion/index.md` (category `arch`) with cover, title, date, and short body
- [x] 7.2 Create `src/content/posts/2024-funkfest/index.md` (category `funkfest`) with cover and a gallery of 2–3 images using `data-lightbox` links
- [x] 7.3 Create `src/content/posts/2024-zine-issue-one/index.md` (category `zine`) with cover and a short body
- [x] 7.4 Create `src/content/posts/2024-foto-walk/index.md` (category `foto`) with cover and inline images
- [x] 7.5 Create `src/content/posts/2023-coffee-notes/index.md` (category `coffee`) with cover and text-only body
- [x] 7.6 Create `src/content/posts/2023-music-mix/index.md` (category `music`) with cover and an embedded audio or YouTube embed
- [x] 7.7 Use placeholder images (sourced or generated) sized roughly 1600×1000 so the image pipeline has real work to do

## 8. README and developer docs

- [x] 8.1 Create `README.md` with sections: Overview, Local development, Adding a post (copy-paste frontmatter template), Adding a category, Deploying to Cloudflare Pages, Project layout
- [x] 8.2 Include the exact frontmatter template (all fields, with comments explaining each)
- [x] 8.3 Document Cloudflare Pages settings explicitly: preset *Astro*, build command `npm run build`, output `dist`, Node 20+, no env vars
- [x] 8.4 Document the "add a category" workflow: edit `src/lib/categories.ts` (tuple + labels), commit, push — nothing else

## 9. Verification

- [x] 9.1 Run `npm run build` and confirm it exits zero, produces `dist/`, and that `dist/index.html`, `dist/feed.xml`, one `dist/<category>/index.html` per category, and one `dist/posts/<slug>/index.html` per published seed post are all present
- [x] 9.2 Run `npm run preview` and manually verify: homepage feed is newest-first; clicking a feed item opens the post; each category page lists only its posts; 404 page renders with the site layout; lightbox opens/closes/navigates on the funkfest gallery
- [x] 9.3 Manually verify dark/light mode swap by toggling OS preference (or DevTools `prefers-color-scheme` emulation)
- [x] 9.4 Disable JavaScript in the browser and verify every page is still readable and navigable; lightbox links degrade to normal image links; clock shows a static initial value
- [x] 9.5 Verify accessibility basics: tab order is sensible, focus indicator is visible, every `<img>` has an `alt`, skip-to-content link works
- [x] 9.6 Confirm a draft post (set `draft: true` on one seed entry temporarily) is hidden from the production build (`npm run build`) and present during `npm run dev`; revert the change
