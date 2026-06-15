## ADDED Requirements

### Requirement: Homepage feed (newest first)

The site SHALL render a homepage at `/` showing every non-draft post sorted by `date` descending (newest first). Each feed item MUST display the post's cover (when present), title, date, and bilingual category label, and MUST link to the single-post view.

A short header line MUST appear above the feed in the spirit of `newest first • everything visible • click for single view`.

#### Scenario: Homepage lists posts newest first

- **WHEN** the site is built with multiple non-draft posts whose `date` values span different days
- **THEN** the homepage renders them in descending `date` order, with the most recent post first

#### Scenario: Feed item links to the post

- **WHEN** a user clicks a feed item on the homepage
- **THEN** the browser navigates to `/posts/<slug>/` for that post

#### Scenario: Header tagline is present

- **WHEN** a visitor loads the homepage
- **THEN** a short header line conveying "newest first • everything visible • click for single view" is rendered above the feed

#### Scenario: Drafts are not in the production feed

- **WHEN** the production build is generated with one or more posts marked `draft: true`
- **THEN** none of those posts appear on the homepage

### Requirement: Per-category feed routes

The site SHALL generate one static route per category at `/[category]/`, derived automatically from the categories tuple. Each category page MUST render its category's posts newest-first using the same feed item rendering as the homepage, with a heading that shows the bilingual category label.

#### Scenario: Routes are generated automatically

- **WHEN** the categories tuple contains `arch`, `foto`, `music` (and others)
- **THEN** the built site contains `dist/arch/index.html`, `dist/foto/index.html`, `dist/music/index.html`, etc., one per category

#### Scenario: Category page lists only its posts

- **WHEN** a visitor navigates to `/foto/`
- **THEN** the page lists only posts whose `category` is `foto`, newest first, and excludes posts of other categories

#### Scenario: Category page heading uses bilingual label

- **WHEN** a visitor loads a category page
- **THEN** the page heading shows the bilingual ET/EN label for that category (e.g. `foto / photo`)

#### Scenario: Empty category renders gracefully

- **WHEN** a category has no published posts
- **THEN** the category page still exists, with the heading and an empty-state message — not a 404

### Requirement: Single-post view

The site SHALL render one static page per non-draft post at `/posts/<slug>/`. The page MUST render the post body Markdown (including inline images, galleries, video embeds, audio) along with title, date, bilingual category label, and tags (if any).

#### Scenario: Post page exists for each published post

- **WHEN** a non-draft post at `src/content/posts/<slug>/index.md` is built
- **THEN** `dist/posts/<slug>/index.html` exists and renders the post's content

#### Scenario: Inline images are optimized

- **WHEN** a post body references a sibling image via standard Markdown syntax
- **THEN** the built page references an optimized version of that image (processed through Astro's image pipeline) rather than the original file path

#### Scenario: Video and audio embeds render

- **WHEN** a post body includes a YouTube/Vimeo iframe or an HTML5 `<audio>` element via Markdown/MDX
- **THEN** the embed renders in the built page

### Requirement: About, Contact, and styled 404

The site SHALL include static pages at `/about/` and `/contact/`, and a styled `404` page that uses the site's standard layout (header, footer, typography).

#### Scenario: About and Contact are present

- **WHEN** the site is built
- **THEN** `dist/about/index.html` and `dist/contact/index.html` exist and render with the site layout

#### Scenario: 404 uses the site layout

- **WHEN** a request hits an unknown path and Cloudflare Pages serves the 404 page
- **THEN** the rendered page uses the site's header, footer, and typography rather than a default browser/host error page

### Requirement: RSS feed

The site SHALL emit a valid RSS 2.0 feed at `/feed.xml` listing all non-draft posts newest-first, using `@astrojs/rss`. Each item MUST include title, link (absolute URL), publication date, and a description (post summary or excerpt).

#### Scenario: feed.xml is emitted

- **WHEN** `npm run build` runs
- **THEN** `dist/feed.xml` exists and validates as RSS 2.0

#### Scenario: Drafts are absent from RSS

- **WHEN** the production build is generated with one or more draft posts
- **THEN** those posts do not appear in `dist/feed.xml`

#### Scenario: Feed is discoverable via link tag

- **WHEN** a visitor loads any page on the site
- **THEN** the document `<head>` includes `<link rel="alternate" type="application/rss+xml">` pointing at `/feed.xml`
