/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/components/**/*.{js,ts,jsx,tsx,mdx}', './src/app/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      spacing: Object.fromEntries(
        Array.from({ length: 401 }, (_, i) => {
          return [`${i}px`, `${i / 16}rem`];
        }),
      ),
      screens: {
        w500: '500px',
        '2xl': '1536px',
        'pointer-fine': { raw: '(pointer: fine)' },
        'pointer-coarse': { raw: '(pointer: coarse)' },
        'pointer-none': { raw: '(pointer: none)' },
      },
      fontSize: {
        '2xs': '0.625rem',
      },
      colors: {
        alert: '#c10000',
        required: '#fff',
        description: '#6b7179',
      },
      backgroundColor: {
        alert: '#c10000',
        required: '#b20000',
      },
      boxShadow: {
        sticky: '0 2px 4px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)',
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
      padding: {
        paragraph: 'var(--mb-paragraph)',
      },
      margin: {
        paragraph: 'var(--mb-paragraph)',
      },
      space: {
        paragraph: 'var(--mb-paragraph)',
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
        '.transition-fade': {
          transitionProperty: 'opacity, visibility',
          transitionDuration: '300ms',
          transitionTimingFunction: 'ease-out',
        },
        '.transition-bg': {
          transition: '300ms background-color ease-out',
        },
        palt: {
          'font-feature-settings': 'palt',
        },
        '.scroll-hint-x': {
          background: `
            linear-gradient(to right, rgba(255, 255, 255, 0), var(--bg-scroll-hint) 70%) 100% 0,
            linear-gradient(to left, rgba(255, 255, 255, 0), var(--bg-scroll-hint) 30%),
            radial-gradient(farthest-side at 100% 40%, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0)) 100% 0,
            radial-gradient(farthest-side at 0 40%, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0)) 0 0;
          `,
          backgroundRepeat: 'no-repeat',
          backgroundColor: 'var(--bg-scroll-hint)',
          backgroundSize: `
            40px 100%,
            40px 100%,
            14px 120%,
            14px 120%`,
          backgroundAttachment: 'local, local, scroll, scroll',
        },
        '.scroll-hint-y': {
          background: `
            linear-gradient(to top, rgba(255, 255, 255, 0), var(--bg-scroll-hint) 30%) ,
            linear-gradient(to top, var(--bg-scroll-hint), rgba(255, 255, 255, 0) 70%) 0 100%,
            radial-gradient(farthest-side at 50% 0, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0)),
            radial-gradient(farthest-side at 50% 100%, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0)) 0 100%;
          `,
          backgroundRepeat: 'no-repeat',
          backgroundColor: 'var(--bg-scroll-hint)',
          backgroundSize: `
            100% 60px,
            100% 60px,
            100% 14px,
            100% 14px`,
          backgroundAttachment: 'local, local, scroll, scroll',
        },
      });
    },
  ],
  future: {
    hoverOnlyWhenSupported: true,
  },
};
