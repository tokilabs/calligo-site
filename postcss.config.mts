import postcssSyntax from 'postcss-syntax';

const syntax = postcssSyntax({
  rules: [
    {
      test: /\.(?:[sx]?html?|[sx]ht|vue|ux|php)$/i,
      extract: 'html',
    },
    {
      test: /\.(?:markdown|md)$/i,
      extract: 'markdown',
    },
    {
      test: /\.(?:[cm]?[jt]sx?|es\d*|pac)$/i,
      extract: 'jsx',
    },
    {
      // custom language for file extension
      test: /\.postcss$/i,
      lang: 'scss',
    },
  ],

  // custom parser for CSS (using `postcss-safe-parser`)
  css: 'postcss-safe-parser',
  // custom parser for SASS (PostCSS-compatible syntax.)
  sass: 'postcss-sass',
  // custom parser for SCSS (by module name)
  scss: 'postcss-scss',
  // custom parser for LESS (by module path)
  less: 'postcss-less',
});

// postcss(plugins)
//   .process(source, { syntax: syntax })
//   .then(function (result) {
//     // An alias for the result.css property. Use it with syntaxes that generate non-CSS output.
//     result.content;
//   });

import type { Config } from 'postcss-load-config';

const config: Config = {
  syntax: 'postcss-scss',
  map: 'inline',
  plugins: {
    'postcss-easy-import': {
      extensions: ['.css', '.scss'],
    },
    stylelint: {
      /* your options */
    },
    'postcss-reporter': { clearReportedMessages: true },
    'postcss-use': {},
    'postcss-scss': {},
    'postcss-html': {},
    'postcss-markdown': {},
    'postcss-utilities': {},
    'postcss-sass': {},
    'postcss-safe-parser': {},
    'postcss-font-magician': {},
    colorguard: {},
    'postcss-load-config': {},
    autoprefixer: {},
    cssnano: {},
    'postcss-sorting': {
      order: [
        'custom-properties',
        'dollar-variables',
        'declarations',
        'at-rules',
        'rules',
      ],

      'properties-order': 'alphabetical',

      'unspecified-properties-position': 'bottom',
    },
  },
};

export default config;
