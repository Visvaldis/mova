// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

// Deployed to GitHub Pages at https://visvaldis.github.io/mova/
// `site` + `base` make all generated URLs resolve correctly under the /mova/ subpath.
// When developing locally the dev server also serves under /mova/ (http://localhost:4321/mova/).
export default defineConfig({
  site: 'https://visvaldis.github.io',
  base: '/mova',
  trailingSlash: 'always',
  integrations: [react()],
  markdown: {
    // Articles are rendered manually with `marked` (so the interactive island can be
    // injected at the <!-- INTERACTIVE --> marker), but keep Astro's defaults sane too.
    gfm: true,
  },
});
