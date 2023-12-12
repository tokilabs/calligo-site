/** @type {import("prettier").Config} */
const config = {
  plugins: ["prettier-plugin-astro"],

  singleQuote: true,
  bracketSameLine: true,
  jsxBracketSameLine: true,
  bracketSpacing: true,
  htmlWhitespaceSensitivity: "ignore",

  overrides: [
    {
      files: "*.astro",
      options: {
        parser: "astro",
        bracketSameLine: true,
      },
    },
  ],
};

console.log(config);

export default config;
