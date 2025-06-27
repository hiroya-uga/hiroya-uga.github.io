module.exports = {
  printWidth: 120,
  useTabs: false,
  tabWidth: 2,
  singleQuote: true,
  trailingComma: 'all',
  semi: true,
  endOfLine: 'lf',
  htmlWhitespaceSensitivity: 'ignore',

  overrides: [
    {
      files: ['**/*.css'],
      options: {
        singleQuote: false,
      },
    },
  ],

  plugins: ['prettier-plugin-organize-imports', 'prettier-plugin-tailwindcss'],
  tailwindStylesheet: './src/app/global.css',
  tailwindFunctions: ['clsx'],
};
