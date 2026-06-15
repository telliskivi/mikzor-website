## ADDED Requirements

### Requirement: Minimal typographic aesthetic

The site SHALL present a minimal, content-forward aesthetic: lowercase, understated typography (a clean grotesk or monospace), near-black on off-white as the default palette, with at most one accent color, and generous whitespace. The visual design MUST be consistent across pages via a shared layout and global stylesheet.

#### Scenario: Palette uses near-black on off-white by default

- **WHEN** a visitor loads the site in a browser with `prefers-color-scheme: light`
- **THEN** the page background is an off-white (not pure `#fff`) and the body text is near-black (not pure `#000`)

#### Scenario: Typography is a single, consistent stack

- **WHEN** a visitor inspects any page
- **THEN** the body text uses one consistent type family across the site (a clean grotesk or monospace stack), with no per-page typeface overrides

### Requirement: Responsive, image-led feed grid

The homepage and category feeds SHALL render an image-led layout that is responsive across mobile, tablet, and desktop. The layout MAY be a vertical stream or masonry grid, and MUST remain readable and well-spaced at viewport widths from 320px upward.

#### Scenario: Feed reflows on small screens

- **WHEN** a visitor loads the homepage at a viewport width of 360px
- **THEN** feed items reflow into a single readable column with no horizontal scroll

#### Scenario: Feed uses an image-led layout on wide screens

- **WHEN** a visitor loads the homepage at a viewport width of 1280px
- **THEN** feed items render with their cover image visually leading the item, with title/date/category as a secondary band

### Requirement: Light and dark theme via `prefers-color-scheme`

The site SHALL respect the visitor's `prefers-color-scheme` setting and provide both a light and a dark palette. Theming MUST be implemented with CSS custom properties so swapping is a token-level change, not a per-component override.

#### Scenario: Dark mode adopted automatically

- **WHEN** a visitor's OS or browser is set to `prefers-color-scheme: dark`
- **THEN** the site renders with a dark palette (dark background, light foreground) without user interaction

#### Scenario: No flash of incorrect theme on first paint

- **WHEN** a visitor with `prefers-color-scheme: dark` loads a page
- **THEN** the dark palette is applied on the very first paint (no light-mode flash)

### Requirement: Accessibility baseline

Pages SHALL be built from semantic HTML (`<header>`, `<main>`, `<nav>`, `<article>`, headings in order, etc.), keyboard-navigable, and provide visible focus styles. Every meaningful image MUST have descriptive `alt` text; decorative images MUST have `alt=""`. The post schema MAY allow Markdown-authored images without `alt` but the design templates and seed content MUST set `alt` correctly.

#### Scenario: Keyboard navigation works

- **WHEN** a visitor tabs through the homepage
- **THEN** focus moves through interactive elements in a sensible order and a visible focus indicator is shown on the focused element

#### Scenario: Cover images have alt text

- **WHEN** the homepage renders a feed item whose post has a cover image
- **THEN** the `<img>` element has a non-empty `alt` attribute (defaulting to the post title if no explicit alt is provided)

#### Scenario: Skip-to-content link exists

- **WHEN** a keyboard user first presses Tab on any page
- **THEN** a "skip to content" link becomes visible and, when activated, moves focus to the main content region

### Requirement: OpenGraph, Twitter card, favicon, and per-post share images

Every page SHALL emit OpenGraph and Twitter card meta tags via a reusable `<Head>` component. Post pages MUST use their `cover` image (when present) as the share image, with a documented site-wide fallback OG image stored in `public/`. The site MUST set a favicon and a canonical URL.

#### Scenario: Post page emits cover as OG image

- **WHEN** a post has a `cover` image and is rendered
- **THEN** the page's `<head>` contains `<meta property="og:image">` (and `<meta name="twitter:image">`) referencing the optimized cover URL

#### Scenario: Pages without a cover use the fallback OG image

- **WHEN** a page (e.g. `/about/`) has no cover image
- **THEN** the page's `<head>` references the site-wide fallback OG image stored in `public/`

#### Scenario: Favicon and canonical are set

- **WHEN** a visitor inspects any page's `<head>`
- **THEN** the page includes a `<link rel="icon">` and a `<link rel="canonical">` with an absolute URL
