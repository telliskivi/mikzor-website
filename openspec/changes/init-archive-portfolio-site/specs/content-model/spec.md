## ADDED Requirements

### Requirement: Single `posts` content collection

The site SHALL define exactly one Astro Content Collection named `posts`, located at `src/content/posts/`. All editorial content MUST live in this collection — no parallel collections, no out-of-collection Markdown pages used as posts.

#### Scenario: Collection is declared in config.ts

- **WHEN** a developer opens `src/content/config.ts`
- **THEN** a single collection named `posts` is exported via `defineCollection` with a Zod schema

#### Scenario: All posts live under src/content/posts

- **WHEN** a developer lists post files in the repository
- **THEN** every post is located under `src/content/posts/` and nowhere else

### Requirement: Folder-per-post layout with colocated assets

Each post SHALL be a folder under `src/content/posts/` containing an `index.md` (or `index.mdx`) and any image, audio, or other binary assets the post references. Posts MUST reference their assets with relative paths so Astro's image pipeline can process them.

#### Scenario: Authoring with a sibling image

- **WHEN** an author creates `src/content/posts/2024-funkfest/index.md` with `cover: ./cover.jpg` in frontmatter and drops `cover.jpg` into the same folder
- **THEN** `npm run build` succeeds, the cover image is optimized via Astro's image pipeline, and the post renders the optimized image

#### Scenario: Slug is derived from the folder name

- **WHEN** a post lives at `src/content/posts/<slug>/index.md`
- **THEN** the post is reachable at `/posts/<slug>/` in the built site

### Requirement: Typed frontmatter schema (Zod)

The `posts` collection schema SHALL be defined with Zod and MUST include the following fields with the stated semantics:

- `title: string` — required.
- `date: Date` — required; parsed via `z.coerce.date()` so ISO date strings (e.g. `2024-08-12`) are accepted.
- `category: enum` — required; the value MUST be one of the enum members from the single source-of-truth categories module (see `interactive-islands`/`design-system` are unrelated; the canonical list lives in a dedicated `lib/categories` module).
- `tags: string[]` — optional; defaults to `[]`.
- `cover: image()` — optional; uses Astro's collection `image()` helper so the cover is optimized.
- `draft: boolean` — optional; defaults to `false`.

Unknown frontmatter fields MAY be ignored; required fields missing or of the wrong type MUST cause `npm run build` to fail with a validation error.

#### Scenario: Missing required field fails build

- **WHEN** a post is committed with no `title` field in frontmatter
- **THEN** `npm run build` exits non-zero with a Zod validation error identifying the missing field

#### Scenario: Cover image is optimized

- **WHEN** a post declares a `cover` referencing a sibling JPEG
- **THEN** the built site emits an optimized image (a hashed filename in `dist/_astro/` or similar) and references it from the post's HTML

#### Scenario: Tags default to empty array

- **WHEN** a post omits the `tags` field
- **THEN** the post entry's parsed `data.tags` is the empty array `[]`

### Requirement: Categories are extensible from one module

The set of valid categories SHALL be exported from a single module (e.g. `src/lib/categories.ts`) as a `readonly` tuple, and the Zod enum on the `posts` schema MUST be derived from that tuple. Adding a new category MUST require editing only this module (the categories tuple plus its label map).

#### Scenario: New category added with one edit

- **WHEN** a developer appends a new identifier (e.g. `'textile'`) to the categories tuple in `src/lib/categories.ts` and adds a matching entry to the labels map
- **THEN** the Zod schema accepts posts with `category: textile`, a `/textile/` route is generated automatically at build time, and no other source file needs to be edited

#### Scenario: Category not in the tuple is rejected

- **WHEN** a post declares `category: undefined-category` (not present in the tuple)
- **THEN** `npm run build` exits non-zero with a Zod validation error

### Requirement: Draft posts excluded from production builds

Posts with `draft: true` SHALL be excluded from the production build (homepage feed, category feeds, single-post routes, RSS, sitemap). Draft posts MAY be visible during local `npm run dev` to allow preview. A single helper (e.g. `getPublishedPosts()`) SHALL apply this filter; pages MUST NOT call `getCollection('posts')` directly without this helper.

#### Scenario: Draft is hidden in production build

- **WHEN** a post with `draft: true` exists and `npm run build` runs
- **THEN** the post does not appear in `dist/index.html`, in any category page, in `dist/feed.xml`, and `dist/posts/<slug>/index.html` is not generated

#### Scenario: Draft is visible during dev

- **WHEN** a developer runs `npm run dev` with a draft post in the collection
- **THEN** the draft post is visible in the local feed so the author can preview it

### Requirement: Bilingual (Estonian / English) category labels

Every category in the categories module SHALL have an associated `{ et, en }` label pair. UI surfaces that render category names (feed item, category page heading, single-post meta) MUST display the bilingual labels.

#### Scenario: Category appears with both labels

- **WHEN** the site renders a category named `foto` anywhere in the UI
- **THEN** the rendered label includes both `foto` (Estonian) and `photo` (English), separated by a visible delimiter (e.g. `foto / photo`)

#### Scenario: Missing label fails fast

- **WHEN** a developer adds an identifier to the categories tuple but forgets to add a corresponding labels entry
- **THEN** `npm run build` (or a type-level assertion in the module) surfaces a clear error before deploy
