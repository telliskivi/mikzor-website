// Generates placeholder images for seed content using sharp.
// Run with: node scripts/gen-placeholders.mjs
// Safe to re-run; overwrites existing files.

import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const root = resolve(dirname(__filename), '..');

// (bg, fg) pairs chosen to look distinguishable but cohesive with the palette.
const palettes = {
  sand:     { bg: '#e7e1d2', fg: '#3a2e1f' },
  rust:     { bg: '#c4452a', fg: '#f6f4ee' },
  forest:   { bg: '#2e3a2f', fg: '#e7e1d2' },
  paper:    { bg: '#f0ede4', fg: '#1a1817' },
  cobalt:   { bg: '#1f3a55', fg: '#e6ecf3' },
  amber:    { bg: '#caa45a', fg: '#1a1409' },
  charcoal: { bg: '#221f1c', fg: '#d8d3c5' },
  blush:    { bg: '#deb6a8', fg: '#3b1e15' },
  moss:     { bg: '#7a8662', fg: '#1d1f15' },
  espresso: { bg: '#3a1f15', fg: '#e9d6b8' },
};

function svgFor(width, height, palette, label) {
  const { bg, fg } = palette;
  const fontSize = Math.round(Math.min(width, height) * 0.07);
  const subFontSize = Math.round(fontSize * 0.45);
  // simple geometric mark + label
  return `
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <rect width="100%" height="100%" fill="${bg}"/>
  <g stroke="${fg}" stroke-width="${Math.round(width * 0.0025)}" fill="none" opacity="0.55">
    <circle cx="${width * 0.78}" cy="${height * 0.28}" r="${Math.min(width, height) * 0.18}"/>
    <line x1="${width * 0.08}" y1="${height * 0.82}" x2="${width * 0.62}" y2="${height * 0.82}"/>
    <line x1="${width * 0.08}" y1="${height * 0.86}" x2="${width * 0.44}" y2="${height * 0.86}"/>
  </g>
  <g font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace"
     fill="${fg}">
    <text x="${width * 0.08}" y="${height * 0.18}" font-size="${subFontSize}" opacity="0.7">placeholder</text>
    <text x="${width * 0.08}" y="${height * 0.28}" font-size="${fontSize}" font-weight="600">${label}</text>
  </g>
</svg>`.trim();
}

async function makeJpg(outPath, { width = 1600, height = 1000, palette, label }) {
  const svg = svgFor(width, height, palette, label);
  await mkdir(dirname(outPath), { recursive: true });
  await sharp(Buffer.from(svg))
    .jpeg({ quality: 80, mozjpeg: true })
    .toFile(outPath);
  console.log(`  ✓ ${outPath.replace(root + '/', '').replace(root + '\\', '')}`);
}

async function makePng(outPath, { width, height, palette, label }) {
  const svg = svgFor(width, height, palette, label);
  await mkdir(dirname(outPath), { recursive: true });
  await sharp(Buffer.from(svg)).png().toFile(outPath);
  console.log(`  ✓ ${outPath.replace(root + '/', '').replace(root + '\\', '')}`);
}

const jobs = [
  // OG fallback (1200x630)
  ['public/og-default.png',                                 { width: 1200, height: 630,  palette: palettes.sand,     label: 'mikael ristmets' }, makePng],

  // 2025-arch-pavilion
  ['src/content/posts/2025-arch-pavilion/cover.jpg',        { palette: palettes.sand,     label: 'arch · pavilion'   }, makeJpg],

  // 2024-funkfest
  ['src/content/posts/2024-funkfest/cover.jpg',             { palette: palettes.rust,     label: 'funkfest 2024'     }, makeJpg],
  ['src/content/posts/2024-funkfest/gallery-1.jpg',         { palette: palettes.amber,    label: 'funkfest · 01'     }, makeJpg],
  ['src/content/posts/2024-funkfest/gallery-2.jpg',         { palette: palettes.espresso, label: 'funkfest · 02'     }, makeJpg],
  ['src/content/posts/2024-funkfest/gallery-3.jpg',         { palette: palettes.blush,    label: 'funkfest · 03'     }, makeJpg],

  // 2024-zine-issue-one
  ['src/content/posts/2024-zine-issue-one/cover.jpg',       { palette: palettes.paper,    label: 'zine · issue 01'   }, makeJpg],

  // 2024-foto-walk
  ['src/content/posts/2024-foto-walk/cover.jpg',            { palette: palettes.cobalt,   label: 'foto · walk'       }, makeJpg],
  ['src/content/posts/2024-foto-walk/inline-1.jpg',         { palette: palettes.forest,   label: 'foto · 01'         }, makeJpg],
  ['src/content/posts/2024-foto-walk/inline-2.jpg',         { palette: palettes.charcoal, label: 'foto · 02'         }, makeJpg],

  // 2023-coffee-notes
  ['src/content/posts/2023-coffee-notes/cover.jpg',         { palette: palettes.espresso, label: 'coffee · notes'    }, makeJpg],

  // 2023-music-mix
  ['src/content/posts/2023-music-mix/cover.jpg',            { palette: palettes.moss,     label: 'music · mix'       }, makeJpg],

  // 2024-ambient-232
  ['src/content/posts/2024-ambient-232/cover.jpg',          { palette: palettes.charcoal, label: 'ambient · 232 wip' }, makeJpg],

  // 2021-15012021a
  ['src/content/posts/2021-15012021a/cover.jpg',            { palette: palettes.cobalt,   label: '15.01.2021a'       }, makeJpg],
];

console.log('generating placeholder images…');
for (const [rel, opts, fn] of jobs) {
  await fn(resolve(root, rel), opts);
}
console.log('done.');
