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

  overrides: [
    {
      files: ['**/*.css'],
      options: {
        singleQuote: false,
      },
    },
  ],
};
