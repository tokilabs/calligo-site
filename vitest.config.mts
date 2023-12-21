import { getViteConfig } from 'astro/config';
import { configDefaults } from 'vitest/config';

export default getViteConfig({
  test: {
    // Vitest configuration options
    // ...configDefaults,
    // root: 'src',
    includeSource: ['src/**/*.{js,ts}'],
    exclude: [...configDefaults.exclude, '**/trash/**'],
    coverage: {
      provider: 'istanbul',
      enabled: true,
      all: true,
      allowExternal: true,
      clean: true,
      cleanOnRerun: true,
      // include: ['**/src/**/*.ts'],
      exclude: ['**/trash/**', '**/?(_)deprecated/**'],
    },
  },
  server: {
    middlewareMode: true,
  },
});
