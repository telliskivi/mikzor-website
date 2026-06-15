# Adding content to the website

A short, practical guide for the website owner. No coding required — just a
text editor, a folder, and `git push`.

If you ever get stuck, the answer is almost always one of these three:

1. You forgot a required field in the frontmatter.
2. The category name doesn't match one of the allowed values.
3. The image filename doesn't match what the markdown is referencing.

---

## How posts work, in one paragraph

Every post on the site lives in its own folder under
`src/content/posts/`. The folder name is the URL — a folder called
`2024-funkfest` becomes `https://your-site.com/posts/2024-funkfest/`.
Inside each folder there is one `index.md` file (the text) and any
images, audio, or other files the post uses. Push the changes to git
and the site rebuilds itself automatically.

---

## 1 — Add a new post

### Step 1: make a folder

Pick a short, descriptive folder name. Stick to lowercase letters, numbers, and
hyphens. Starting the name with the year is a nice habit because it sorts
nicely in your file browser. Examples:

```
2025-spring-show
2025-coffee-notes-april
2024-funkfest
```

The folder goes inside `src/content/posts/`:

```
src/content/posts/2025-spring-show/
```

### Step 2: create `index.md` inside that folder

Copy this template into a new file called `index.md` and fill it in:

```markdown
---
title: my post title
date: 2025-06-15
category: writing
tags: [tag-one, tag-two]
cover: ./cover.jpg
coverAlt: a short description of what's in the cover image
description: a one-line summary used for search engines and the RSS feed.
draft: false
---

your post body goes here. plain markdown.

you can write paragraphs like this. you can have headings:

## a heading

bullets:

- one
- two
- three

[a link](https://example.com), **bold text**, *italic text*.
```

### Step 3: drop your images into the same folder

```
src/content/posts/2025-spring-show/
  index.md
  cover.jpg
  inside-the-room.jpg
  detail-1.jpg
```

You'll reference these images from the markdown with **relative paths**
that start with `./`, like `./cover.jpg`. See section 4 below.

### Step 4: push to git

```
git add src/content/posts/2025-spring-show
git commit -m "add 2025 spring show"
git push
```

That's it. Cloudflare Pages picks up the push, rebuilds the site, and
deploys. Usually it takes 30–90 seconds.

---

## 2 — The frontmatter, field by field

The "frontmatter" is the block at the top of `index.md` between the two
`---` lines. Every field below is checked when the site builds — if you
forget a required field or use a wrong value, the build will tell you.

| Field        | Required | Notes                                                                |
|--------------|:--------:|----------------------------------------------------------------------|
| `title`      | yes      | The headline of the post. Plain text. Quotes optional.               |
| `date`       | yes      | When the post should be dated. `YYYY-MM-DD` is the simplest form.    |
| `category`   | yes      | One of the allowed categories (see below).                           |
| `tags`       | no       | A list of free-form tags. Leave empty if you don't want any.         |
| `cover`      | no       | Path to a cover image. Always starts with `./`.                      |
| `coverAlt`   | no       | A short text description of the cover for accessibility.             |
| `description`| no       | One-line summary used in search engines, social shares, and the RSS. |
| `draft`      | no       | `true` hides the post from the live site (see section 7).            |

### Categories you can pick from

These are the current categories. Use the exact name on the left:

```
writing
work
exhibitions
photography
music
coffee
```

If you'd like a new one, see section 9.

### Date format

Any of these work:

```yaml
date: 2025-06-15
date: 2025-06-15T14:30
date: "June 15, 2025"
```

Pick one and be consistent. The simplest is `YYYY-MM-DD`.

### Tags

```yaml
tags: [studio, sketch, timber]
```

Tags are free-form — you don't have to declare them anywhere first. They
appear under the post title.

---

## 3 — Cover images

The cover image shows up:

- As the thumbnail in the feed on the homepage and category pages.
- Big at the top of the post itself.
- As the social-share preview when the post is linked on social media.

Best practice for covers:

- **Size:** at least 1600 pixels wide. 1600×1000 is a sweet spot.
- **Format:** JPG or PNG. The site automatically optimises both.
- **Crop:** the feed thumbnail crops to a roughly 16:10 rectangle, so
  keep the important part of the image away from the edges.
- **Filename:** name it `cover.jpg` or `cover.png` — anything works, but
  `cover.*` is the convention.

In the frontmatter:

```yaml
cover: ./cover.jpg
coverAlt: a model of a small timber pavilion lit from one side
```

Always write `coverAlt` if you can — it helps screen readers, and shows
up if the image fails to load.

---

## 4 — Inline images in the body

Use the standard markdown image syntax with a relative path:

```markdown
some text before the image.

![a short description of the image](./inside-the-room.jpg)

some text after.
```

Notes:

- The text in the square brackets is the **alt text** — write something
  descriptive, not just "image" or "photo".
- The path always starts with `./` and points to a file in the same folder
  as the `index.md`.
- You can also use full URLs (`https://...`) for images hosted elsewhere,
  but they won't be optimised and aren't recommended.

---

## 5 — Photo galleries (with the lightbox)

For a grid of photos where clicking opens a fullscreen viewer, use this
block. Replace `my-gallery` with anything unique (it's just a name to
group the images together) and add as many `<a>...</a>` blocks as you
want:

```html
<div class="gallery">
  <a href="./photo-1.jpg" data-lightbox data-gallery="my-gallery" data-alt="caption for photo 1">
    <img src="./photo-1.jpg" alt="caption for photo 1" />
  </a>
  <a href="./photo-2.jpg" data-lightbox data-gallery="my-gallery" data-alt="caption for photo 2">
    <img src="./photo-2.jpg" alt="caption for photo 2" />
  </a>
  <a href="./photo-3.jpg" data-lightbox data-gallery="my-gallery" data-alt="caption for photo 3">
    <img src="./photo-3.jpg" alt="caption for photo 3" />
  </a>
</div>
```

What this gives you:

- A responsive thumbnail grid.
- Click any image → fullscreen overlay.
- Arrow keys navigate between images in the same gallery.
- Escape closes the overlay.

If you have a second gallery in the same post, just give it a different
`data-gallery` name (e.g. `"detail-shots"`).

> Look at `src/content/posts/2024-funkfest/index.md` for a working example.

---

## 6a — Coloured emphasis on individual words

You can highlight specific words in red or blue (like the reference layout
where keywords like `photography` and `darkroom` are coloured). Wrap the
word in a span with the right class:

```html
<span class="red">fotograafia</span> on hea silma arendaja...

with <span class="red">photography</span> one is able to study urban
space more analytically, which makes <span class="blue">darkrooms</span>
an important part of the work.
```

Two classes are available:

- `red` — brick red accent (`#8b1f1f`)
- `blue` — deep cobalt accent (`#1f3a8b`)

You can also use plain markdown emphasis for the same effect:

- `**bold text**` → renders in red
- `*italic text*` → renders in blue

Use these sparingly — they lose meaning if everything is coloured.

---

## 6 — Embedding media

You can paste these embed snippets directly into a post body.

### SoundCloud

Get the track URL from SoundCloud (looks like
`https://soundcloud.com/youraccount/track-name`). Then:

```html
<iframe
  width="100%"
  height="166"
  scrolling="no"
  frameborder="no"
  loading="lazy"
  allow="autoplay"
  title="track name on soundcloud"
  src="https://w.soundcloud.com/player/?url=https%3A//soundcloud.com/youraccount/track-name&color=%23c4452a&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false"
></iframe>
```

You only need to replace the `track-name` part of the URL in the `src=`
attribute (and the `title`).

### Spotify (album, playlist, or single track)

Find the share link on Spotify (right-click → Share → Copy link). The link
looks like `https://open.spotify.com/playlist/2aWwGoIr6ze26x4q4cBC5u?...`.
The part after `playlist/` (or `album/` or `track/`) is the ID. Then:

```html
<iframe
  src="https://open.spotify.com/embed/playlist/2aWwGoIr6ze26x4q4cBC5u?utm_source=generator"
  title="playlist name on spotify"
  width="100%"
  height="352"
  frameborder="0"
  allowfullscreen
  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
  loading="lazy"
></iframe>
```

For an album use `embed/album/<id>`; for a single track use
`embed/track/<id>`.

### YouTube

Take the 11-character ID from the YouTube URL (e.g. for
`https://www.youtube.com/watch?v=dQw4w9WgXcQ` the ID is `dQw4w9WgXcQ`),
then:

```html
<iframe
  width="100%"
  height="450"
  src="https://www.youtube.com/embed/dQw4w9WgXcQ"
  title="video title"
  frameborder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  loading="lazy"
  allowfullscreen
></iframe>
```

### Vimeo

```html
<iframe
  src="https://player.vimeo.com/video/123456789"
  width="100%"
  height="450"
  frameborder="0"
  allow="autoplay; fullscreen; picture-in-picture"
  loading="lazy"
  allowfullscreen
  title="video title"
></iframe>
```

Replace `123456789` with the actual Vimeo video ID.

### A local audio file

Drop the audio file into the post's folder (e.g. `track.mp3`), then:

```html
<audio controls preload="none" src="./track.mp3">
  your browser doesn't support audio playback.
</audio>
```

---

## 7 — Drafts and unpublishing

To save a post but keep it off the live site, set `draft: true` in the
frontmatter:

```yaml
draft: true
```

What that means:

- It will **not** appear on the homepage, on category pages, or in the
  RSS feed on the live site.
- It will **still** be visible if you preview the site locally with
  `npm run dev` (see section 8) — handy for sharing a preview link
  with someone before publishing.
- When you're ready to publish, change `draft: true` to `draft: false`
  (or just delete the line) and push.

To take a published post offline temporarily, change it back to
`draft: true` and push.

---

## 8 — Previewing changes locally before pushing (optional)

You don't have to do this — but if you'd like to see your changes
before they go live, install Node 20 once, then in this folder:

```bash
npm install         # only the first time
npm run dev         # starts a local preview
```

It will print an address (something like `http://localhost:4321/`) — open
that in a browser. As you save your `index.md`, the preview updates
automatically. Press Ctrl+C in the terminal to stop it.

---

## 9 — Adding a new category

If none of the six existing categories fits what you want to post, you
can add a new one. This is the one place you'll have to edit a code
file. Don't worry — it's a single file, two lines.

Open `src/lib/categories.ts`. You'll see two blocks:

```ts
export const CATEGORIES = [
  'writing',
  'work',
  'exhibitions',
  'photography',
  'music',
  'coffee',
] as const;
```

and:

```ts
export const LABELS = {
  writing:     { et: 'kirjutamine', en: 'writing' },
  work:        { et: 'töö',         en: 'work' },
  exhibitions: { et: 'näitused',    en: 'exhibitions' },
  photography: { et: 'foto',        en: 'photography' },
  music:       { et: 'muusika',     en: 'music' },
  coffee:      { et: 'kohv',        en: 'coffee' },
} as const satisfies Record<Category, Label>;
```

To add a new category — say, `cinema`:

1. Add `'cinema',` to the bottom of the `CATEGORIES` list (note the comma).
2. Add a matching line to `LABELS`:
   `cinema: { et: 'kino', en: 'cinema' },`

Save, commit, push. The site rebuilds. A new `/cinema/` page is created
automatically and "cinema" appears in the side menu. From then on,
posts can use `category: cinema` in their frontmatter.

If you remove a category, make sure no existing posts still use it
first — the build will fail and tell you which post needs updating.

---

## 10 — Renaming or deleting a post

### Renaming the folder (changing the URL)

If you rename `src/content/posts/old-name/` to
`src/content/posts/new-name/`, the URL changes from
`/posts/old-name/` to `/posts/new-name/`. Anyone who linked to the
old URL will get a 404. Rename sparingly.

### Deleting a post

Delete the entire folder. Commit, push. The post and its page are
gone.

If you'd rather just hide it temporarily, use `draft: true` instead
(section 7).

---

## 11 — Common problems and how to fix them

**The build failed and mentioned my post.**
Open the build log. The most common errors are:

- `Missing required field "title"` → you forgot a required frontmatter
  field. Add it.
- `Invalid enum value. Expected "writing" | "work" | ... got "fotos"` → you
  used a category name that doesn't exist. Check the list in section 2.
- `Image not found: ./cover.jpg` → the filename in the frontmatter doesn't
  match the actual file in the folder. Check the spelling and the
  extension (`.jpg` vs `.jpeg`).

**My post didn't show up on the live site.**
- Did you push? `git status` should say "nothing to commit".
- Is `draft: true` set? Take it off.
- Is the date in the future? Posts with a future date still publish,
  but they sort accordingly. (If you want to schedule, just don't
  push until the day.)

**The image looks rotated / sideways.**
Camera metadata. Open the image, rotate it to the correct orientation,
re-export, and replace the file.

**The cover image looks cropped weirdly.**
The feed thumbnail uses a 16:10 crop. If the important part of your
image is right at the edge, consider re-cropping the original a little
looser before exporting.

**Where do I find the build log?**
In Cloudflare Pages: project → Deployments → click the latest deploy
→ "Build log". The error message is usually near the bottom in red.

---

## Quick checklist when adding a post

- [ ] New folder under `src/content/posts/` with a sensible slug
- [ ] `index.md` inside, with the frontmatter template filled in
- [ ] Required fields: `title`, `date`, `category`
- [ ] Cover image in the folder, referenced by `cover: ./...`
- [ ] `coverAlt` written (short, descriptive)
- [ ] Any inline images sitting next to `index.md`
- [ ] `description:` line written (helps social shares + RSS)
- [ ] `draft: false` (or removed entirely)
- [ ] `git add`, `git commit`, `git push`
- [ ] Wait a minute. Check the live site.
