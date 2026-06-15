# mikael ristmets — archive / portfolio

A fully static personal site: part archive feed, part portfolio. Built with
[Astro](https://astro.build), zero runtime services, hosted free on
[Cloudflare Pages](https://pages.cloudflare.com/).

Adding a post is "drop a folder + push":

```
src/content/posts/<slug>/
  index.md       ← frontmatter + body
  cover.jpg      ← optional, optimized automatically
  gallery-1.jpg  ← any other images you reference
```

---

## Local development

Requires Node 20+ (a `.nvmrc` pins this).

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # writes static site to dist/
npm run preview  # serve the build locally
```

`npm run dev` shows draft posts so you can preview them. `npm run build`
excludes anything marked `draft: true`.

---

## Adding a post

> **For non-developers / the site owner:** the full step-by-step guide
> lives at **[docs/adding-content.md](docs/adding-content.md)** — covers
> drafts, galleries, SoundCloud / Spotify / YouTube embeds, troubleshooting,
> and a quick checklist. Read that one if you just want to add content.

Quick version for developers:

1. Create a new folder under `src/content/posts/`. The folder name becomes the
   URL slug (e.g. `2024-funkfest/` → `/posts/2024-funkfest/`).
2. Create `index.md` inside it and paste the template below.
3. Drop any images into the same folder. Reference them with **relative paths**
   from the markdown (e.g. `cover: ./cover.jpg`, `![alt](./inline-1.jpg)`).
4. Commit and `git push`. Cloudflare Pages rebuilds and deploys automatically.

### Frontmatter template (copy + paste)

```yaml
---
# required
title: my post title
date: 2025-06-15                # any ISO date Astro can parse
category: arch                  # one of the categories in src/lib/categories.ts

# optional
tags: [tag-one, tag-two]        # free-form, no enum
cover: ./cover.jpg              # relative path; optimized by Astro
coverAlt: descriptive alt text  # falls back to title if omitted
description: one-line summary   # used in <meta description> and RSS
draft: false                    # true = hidden from production build
---

your markdown body goes here.

inline images are also relative paths:

![alt text](./inline-1.jpg)

galleries opt into the lightbox with two data attributes — same
`data-gallery` id groups images into a navigable set:

<div class="gallery">
  <a href="./gallery-1.jpg" data-lightbox data-gallery="my-gallery" data-alt="caption one">
    <img src="./gallery-1.jpg" alt="caption one" />
  </a>
  <a href="./gallery-2.jpg" data-lightbox data-gallery="my-gallery" data-alt="caption two">
    <img src="./gallery-2.jpg" alt="caption two" />
  </a>
</div>
```

### Categories

Posts must pick one category from the enum. The current list lives in
[`src/lib/categories.ts`](src/lib/categories.ts):

```
arch · chair · hotel · funkfest · zine · mot ·
foto · video · art · music · coffee · other
```

#### Adding a new category

Edit **one file** — `src/lib/categories.ts`:

1. Append the new identifier to the `CATEGORIES` tuple.
2. Add a matching entry to `LABELS` with Estonian + English labels.

```ts
export const CATEGORIES = [
  // …existing,
  'textile',
] as const;

export const LABELS = {
  // …existing,
  textile: { et: 'tekstiil', en: 'textile' },
} as const satisfies Record<Category, Label>;
```

Commit and push. A new `/textile/` route is generated automatically, the
schema accepts `category: textile` immediately, and the nav picks it up.
If you forget the label entry the build fails at type-check.

---

## Deploying to Cloudflare Pages

The repo is configured to deploy with zero environment variables and the
default Astro preset. In the Cloudflare Pages dashboard:

1. *Create project → Connect to Git* → select this repository.
2. Framework preset: **Astro**.
3. Build command: **`npm run build`**.
4. Build output directory: **`dist`**.
5. Node version: **20** (set in *Settings → Environment variables → Production →
   `NODE_VERSION=20`*, or rely on the `.nvmrc` if your project is set to honour it).
6. **No environment variables required.**

Subsequent `git push` to the production branch triggers an automatic redeploy.
Cloudflare keeps a history of previous deploys with one-click rollback.

Before the first real deploy, edit `astro.config.mjs` and replace
`site: 'https://example.tld'` with the actual production URL — this is used by
the sitemap, RSS feed, canonical URLs, and OpenGraph image URLs.

---

## Project layout

```
.
├── astro.config.mjs            # static output, integrations, image service
├── package.json                # scripts + deps
├── tsconfig.json               # extends astro/tsconfigs/strict
├── .nvmrc                      # node 20
├── public/                     # favicon.svg, og-default.png, robots.txt
├── scripts/
│   └── gen-placeholders.mjs    # regenerates seed images with sharp
└── src/
    ├── components/
    │   ├── Head.astro          # <head> meta / OG / twitter / canonical / favicon / rss link
    │   ├── Header.astro        # brand + nav + tallinn clock
    │   ├── Footer.astro
    │   ├── Feed.astro          # responsive grid of FeedItems
    │   ├── FeedItem.astro      # cover · title · date · category
    │   ├── TallinnClock.astro  # client island (live clock)
    │   └── Lightbox.astro      # client island (gallery overlay)
    ├── content/
    │   ├── config.ts           # Zod schema for the `posts` collection
    │   └── posts/<slug>/
    │       ├── index.md
    │       └── *.jpg
    ├── layouts/
    │   ├── BaseLayout.astro
    │   └── PostLayout.astro
    ├── lib/
    │   ├── categories.ts       # single source of truth (CATEGORIES + LABELS)
    │   ├── date.ts             # tiny formatter
    │   ├── posts.ts            # getPublishedPosts() / getPostsByCategory()
    │   └── site.ts             # site-wide metadata
    ├── pages/
    │   ├── index.astro           # /
    │   ├── 404.astro             # styled 404
    │   ├── about.astro           # /about/
    │   ├── contact.astro         # /contact/
    │   ├── feed.xml.js           # /feed.xml (rss)
    │   ├── [category]/index.astro  # /<category>/
    │   └── posts/[...slug].astro   # /posts/<slug>/
    └── styles/global.css       # palette tokens, type/spacing scale, dark mode, resets
```

## Design notes

- **Near-zero JavaScript.** Only two interactive islands ship code: the live
  Tallinn clock in the header and the gallery lightbox. Every page renders and
  navigates fine with JS disabled.
- **Theming via CSS custom properties.** A single `:root` block + a
  `prefers-color-scheme: dark` override drives both palettes. Edit
  [`src/styles/global.css`](src/styles/global.css) to retheme.
- **Image pipeline.** Covers referenced in frontmatter and Markdown bodies go
  through Astro's `astro:assets` + `sharp`, emitting hashed `_astro/*.webp`
  files at multiple widths.
- **Drafts are gated centrally.** Pages never call `getCollection('posts')`
  directly — they use `getPublishedPosts()` from
  [`src/lib/posts.ts`](src/lib/posts.ts), which filters drafts in `import.meta.env.PROD`.

## Regenerating placeholder images

The seed content uses generated SVG-on-JPG placeholders. To regenerate them
(e.g. after adding more seed posts):

```bash
node scripts/gen-placeholders.mjs
```
