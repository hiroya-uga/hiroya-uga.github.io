export const DOMAIN_NAME = process.env.DOMAIN || 'uga.dev';
export const URL_ORIGIN = process.env.URL_ORIGIN || `https://${DOMAIN_NAME}`;
export const SITE_NAME = 'uga.dev';
export const SITE_AUTHOR = 'Hiroya UGA';
export const SITE_SUBTITLE = "A Front-end Engineer's shed";
export const SITE_DESCRIPTION =
  'Web標準とWebアクセシビリティの話が好きな、大器晩成型のフロントエンドエンジニアの物置。';
export const GITHUB_PROFILE = 'https://github.com/hiroya-uga';
export const GITHUB_REPOSITORY = 'https://github.com/hiroya-uga/hiroya-uga.github.io';
export const DEFAULT_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: SITE_NAME,
  url: URL_ORIGIN,
  description: SITE_DESCRIPTION,
  inLanguage: 'ja',
  author: {
    '@type': 'Person',
    name: SITE_AUTHOR,
    url: URL_ORIGIN,
    sameAs: [
      'https://x.com/hiroya_UGA',
      'https://github.com/hiroya-uga',
      'https://www.instagram.com/hiroya.uga',
      'https://www.flickr.com/photos/hiroya-uga/',
      'https://codepen.io/hiroya_uga/',
      'https://www.youtube.com/@hiroya_UGA',
    ],
  },
} as const;
