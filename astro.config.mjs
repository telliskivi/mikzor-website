import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

import cloudflare from "@astrojs/cloudflare";

// Update `site` before the first real deploy — used by sitemap, RSS, and canonical URLs.
export default defineConfig({
  site: 'https://example.tld',
  output: 'static',
  trailingSlash: 'always',

  build: {
    format: 'directory',
  },

  image: {
    // sharp is the default service; declared explicitly so the contract is visible.
    service: { entrypoint: 'astro/assets/services/sharp' },
  },

  integrations: [mdx(), sitemap()],
  adapter: cloudflare()
});