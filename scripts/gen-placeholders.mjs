// Generates placeholder images for seed content using sharp.
// Run with: node scripts/gen-placeholders.mjs
// Safe to re-run; overwrites existing files.

import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const root = resolve(dirname(__filename), '..');

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
  await sharp(Buffer.from(svg)).jpeg({ quality: 80, mozjpeg: true }).toFile(outPath);
  console.log(`  ✓ ${outPath.replace(root + '/', '').replace(root + '\\', '')}`);
}

async function makePng(outPath, { width, height, palette, label }) {
  const svg = svgFor(width, height, palette, label);
  await mkdir(dirname(outPath), { recursive: true });
  await sharp(Buffer.from(svg)).png().toFile(outPath);
  console.log(`  ✓ ${outPath.replace(root + '/', '').replace(root + '\\', '')}`);
}

const jobs = [
  // OG fallback
  ['public/og-default.png',                              { width: 1200, height: 630, palette: palettes.sand,     label: 'mikael ristmets' }, makePng],

  // placeholders for projects we couldn't fetch a real cover for
  ['src/content/posts/2020-photography/cover.jpg',       { palette: palettes.cobalt,   label: 'foto / photo'      }, makeJpg],
  ['src/content/posts/2022-video/cover.jpg',             { palette: palettes.charcoal, label: 'video'             }, makeJpg],
  ['src/content/posts/2023-tuv-mot/cover.jpg',           { palette: palettes.amber,    label: 'tüv / mot'         }, makeJpg],

  // existing music posts — keep their placeholders
  ['src/content/posts/2024-ambient-232/cover.jpg',       { palette: palettes.charcoal, label: 'ambient · 232 wip' }, makeJpg],
  ['src/content/posts/2021-15012021a/cover.jpg',         { palette: palettes.cobalt,   label: '15.01.2021a'       }, makeJpg],
  ['src/content/posts/2023-music-mix/cover.jpg',         { palette: palettes.moss,     label: 'late summer mix'   }, makeJpg],
];

console.log('generating placeholder images…');
for (const [rel, opts, fn] of jobs) {
  await fn(resolve(root, rel), opts);
}
console.log('done.');
