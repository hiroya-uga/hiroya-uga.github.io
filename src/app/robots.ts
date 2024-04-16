import { URL_ORIGIN } from '@/constants/meta';
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    host: URL_ORIGIN,
    rules: {
      userAgent: '*',
      allow: '/',
      // disallow: '/private/',
    },
    sitemap: `${URL_ORIGIN}/sitemap.xml`,
  };
}
