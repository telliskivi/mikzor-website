## ADDED Requirements

### Requirement: Astro project with static output

The site SHALL be built with Astro (latest stable) configured for fully static output. `astro.config.mjs` MUST set `output: 'static'`. The build MUST NOT depend on SSR, serverless functions, edge functions, runtime databases, or any HTTP calls at request time.

#### Scenario: Build produces a plain static directory

- **WHEN** a developer runs `npm run build` against a clean checkout
- **THEN** the command exits successfully and produces a `dist/` directory containing static HTML, CSS, and JS only — no server entrypoint, no `_worker.js`, no functions manifest

#### Scenario: No runtime services are required

- **WHEN** the contents of `dist/` are served by any static file host with no backend
- **THEN** every page in the site renders correctly without requiring environment variables, secrets, or runtime API calls

### Requirement: Node toolchain

The project SHALL target Node.js 20 or newer. A `.nvmrc` (or equivalent declaration) MUST pin the major version so local dev and Cloudflare Pages agree on the runtime.

#### Scenario: Node version is pinned

- **WHEN** a developer inspects the repository root
- **THEN** there is a `.nvmrc` (or `engines.node` field in `package.json`) declaring Node 20 or newer

### Requirement: Reproducible install and dev scripts

`package.json` SHALL expose at minimum the scripts `dev`, `build`, and `preview`, each invoking the corresponding Astro command. `npm install` MUST succeed against a clean machine using only the committed `package.json` (lockfile may be committed but is not required for the spec).

#### Scenario: Fresh clone runs locally

- **WHEN** a developer runs `npm install` then `npm run dev` against a fresh clone
- **THEN** the dev server starts and serves the homepage at the local URL Astro reports, with no manual configuration steps

#### Scenario: Preview serves the production build

- **WHEN** a developer runs `npm run build` followed by `npm run preview`
- **THEN** the production build from `dist/` is served locally and renders identically to the dev server

### Requirement: Cloudflare Pages compatibility

The repository SHALL be deployable to Cloudflare Pages with the framework preset *Astro*, build command `npm run build`, output directory `dist`, and no environment variables. No Cloudflare-specific adapter, edge function, or Worker MUST be required.

#### Scenario: Cloudflare Pages settings match the README

- **WHEN** a reader follows the deployment section of `README.md`
- **THEN** the documented settings are exactly preset *Astro*, build command `npm run build`, output `dist`, Node 20+, with no environment variables

### Requirement: Authoring workflow is documented and minimal

The repository SHALL include a `README.md` that documents (a) local development, (b) the exact copy-paste frontmatter template for a new post, (c) how to add a new category, and (d) the Cloudflare Pages deployment settings. Adding a new post MUST require only: create `src/content/posts/<slug>/index.md`, drop sibling images, paste the frontmatter template, and `git push`.

#### Scenario: New post workflow is one folder plus push

- **WHEN** an author creates `src/content/posts/<slug>/index.md` with the README's frontmatter template, drops a `cover.jpg` into the same folder, and pushes to the configured git remote
- **THEN** Cloudflare Pages rebuilds the site and the new post appears in the feed and at `/posts/<slug>/` with no further steps

#### Scenario: README frontmatter template is valid

- **WHEN** the frontmatter template from `README.md` is copied verbatim into a new `index.md`, with placeholder fields filled in
- **THEN** `npm run build` succeeds and the resulting post is rendered without schema validation errors
