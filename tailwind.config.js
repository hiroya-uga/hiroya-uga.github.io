/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/components/**/*.{js,ts,jsx,tsx,mdx}', './src/app/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      fontSize: {
        '2xs': '0.625rem',
      },
      colors: {
        alert: '#c10000',
      },
      fontFamily: {
        emoji:
          'apple color emoji,segoe ui emoji,noto color emoji,android emoji,emojisymbols,emojione mozilla,twemoji mozilla,segoe ui symbol!important',
        mono: 'Consolas, Monaco, monospace',
      },
      width: {
        dialog: '48rem',
        content: '48rem',
      },
      maxWidth: {
        dialog: '48rem',
        content: '60rem',
        structure: '90rem',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      transitionDuration: {
        DEFAULT: '300ms',
      },
    },
  },
  plugins: [
    ({ addUtilities }) => {
      addUtilities({
        '.transition-bg': {
          transition: '300ms background-color ease-out',
        },
        palt: {
          'font-feature-settings': 'palt',
        },
      });
    },
  ],
  future: {
    hoverOnlyWhenSupported: true,
  },
};
