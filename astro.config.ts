import { defineConfig } from 'astro/config';

import sitemap from '@astrojs/sitemap';
import sentry from '@sentry/astro';
import spotlightjs from '@spotlightjs/astro';

import { astroImageTools } from 'astro-imagetools';

// https://astro.build/config
export default defineConfig({
  site: 'http://preview.calligo.com.br',
  srcDir: './src',
  publicDir: './pubic',
  // base: '',
  integrations: [sentry(), spotlightjs(), sitemap(), astroImageTools],
});
