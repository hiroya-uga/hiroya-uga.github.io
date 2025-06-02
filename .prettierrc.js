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

  plugins: ['prettier-plugin-tailwindcss', 'prettier-plugin-organize-imports'],
};
