import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';

import sitemap from '@astrojs/sitemap';

// Sentry imports
// import sentry from '@sentry/astro';
// // @ts-ignore 2
// import spotlightjs from '@spotlightjs/astro';

// @ts-expect-error Typings are wrong :/
import { astroImageTools } from 'astro-imagetools';

// https://astro.build/config
export default defineConfig({
  site: 'http://preview.calligo.com.br',
  srcDir: './src',
  publicDir: './pubic',
  output: 'hybrid',
  // base: '',
  integrations: [/*sentry(), spotlightjs()*/ sitemap(), astroImageTools],
  adapter: cloudflare(),
});
