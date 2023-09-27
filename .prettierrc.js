module.exports = {
  printWidth: 120,
  useTabs: false,
  tabWidth: 2,
  singleQuote: true,
  trailingComma: 'all',
  semi: true,
  endOfLine: 'lf',
  htmlWhitespaceSensitivity: 'ignore',

  importOrder: ['^(react/(.*)$)|^(react(.*)$)', '^[^@](.*)$'],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
  plugins: ['@trivago/prettier-plugin-sort-imports'],

  overrides: [
    {
      files: ['**/*.css'],
      options: {
        singleQuote: false,
      },
    },
  ],
};
