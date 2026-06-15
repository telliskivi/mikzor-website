## ADDED Requirements

### Requirement: Near-zero JavaScript baseline

The site SHALL ship as close to zero JavaScript as possible. No page MUST require JavaScript to be readable or navigable. JavaScript MAY be present only via Astro islands with `client:*` directives, and only for the two interactive features explicitly permitted (live Tallinn clock, gallery lightbox). No global JavaScript framework runtime (React, Vue, Svelte runtime) MUST be loaded on any page.

#### Scenario: Pages render without JavaScript

- **WHEN** a visitor disables JavaScript and loads the homepage, a category page, or a single post
- **THEN** all content (header, feed/post body, footer, navigation) renders correctly and is fully readable; only the live clock value (a static initial value) and the lightbox interaction (clicks become normal image links) are degraded

#### Scenario: No framework runtime is loaded

- **WHEN** the JavaScript loaded on any built page is inspected
- **THEN** no React, Vue, Svelte, or similar framework runtime is shipped; only the two island scripts described in this capability are present

### Requirement: Live Tallinn clock island

The site header SHALL include a live clock element displaying the current time in the `Europe/Tallinn` timezone, updating once per second. The clock MUST be implemented as an Astro client island. Its initial value MUST be rendered server-side using the same formatting so there is no visible jump or layout shift between SSR and hydration.

#### Scenario: Clock shows Tallinn time

- **WHEN** a visitor loads any page
- **THEN** the header displays the current time formatted for the `Europe/Tallinn` timezone (e.g. `HH:MM:SS`), regardless of the visitor's local timezone

#### Scenario: Clock updates every second

- **WHEN** a visitor stays on a page for at least 3 seconds
- **THEN** the displayed time advances visibly, updating at least once per second

#### Scenario: Initial render matches client hydration

- **WHEN** the page first paints before client JavaScript hydrates
- **THEN** the clock element is already present with a sensible initial value (server-rendered for Tallinn) so there is no layout shift when hydration occurs

### Requirement: Gallery lightbox island

The site SHALL provide a lightweight, vanilla-JS lightbox for images in post bodies that opt in (e.g. via a `data-lightbox` attribute on the link wrapping the image, or all images in a designated gallery container). Clicking an opted-in image MUST open an overlay showing the full-resolution image; the overlay MUST close on Escape and on backdrop click; when multiple images belong to the same gallery, arrow keys MUST navigate between them.

The lightbox MUST be loaded as an Astro island with `client:idle` (or another lazy directive) so it does not delay initial page rendering.

#### Scenario: Click on opted-in image opens overlay

- **WHEN** a visitor clicks an image inside a post body that is opted into the lightbox
- **THEN** an overlay opens displaying the image and dimming the page behind it

#### Scenario: Escape and backdrop close the overlay

- **WHEN** the lightbox overlay is open
- **THEN** pressing Escape closes it, and clicking outside the image (on the backdrop) also closes it

#### Scenario: Arrow keys navigate within a gallery

- **WHEN** the lightbox is open on an image that belongs to a gallery of two or more images
- **THEN** pressing ArrowRight advances to the next image and ArrowLeft returns to the previous, looping at the ends or stopping (implementation choice, but consistent)

#### Scenario: Non-opted-in images do not trigger the lightbox

- **WHEN** a visitor clicks an image in a post body that is not opted into the lightbox
- **THEN** the image behaves as a normal page image (or its surrounding link follows normally) and no overlay opens

#### Scenario: Lightbox loads lazily

- **WHEN** a page that contains gallery images is first loaded
- **THEN** the lightbox script is loaded after the page becomes idle (not on the critical render path) and does not block initial paint
