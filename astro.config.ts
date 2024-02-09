import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Sentry imports
// import sentry from '@sentry/astro';
// // @ts-ignore 2
// import spotlightjs from '@spotlightjs/astro';

// @ts-expect-error Typings are wrong :/
import { astroImageTools } from 'astro-imagetools';
import react from '@astrojs/react';

import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
  site: 'http://preview.calligo.com.br',
  srcDir: './src',
  publicDir: './pubic',
  // base: '',
  integrations: [
    /*sentry(), spotlightjs()*/ sitemap(),
    astroImageTools,
    react(),
    tailwind(),
    mdx(),
  ],
});
