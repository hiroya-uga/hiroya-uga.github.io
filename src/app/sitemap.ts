import { MetadataRoute } from 'next';

import { URL_ORIGIN } from '@/constants/meta';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseURL = URL_ORIGIN;
  const lastModified = new Date();

  const staticPaths = [
    {
      url: baseURL,
      lastModified,
    },
  ];

  return [...staticPaths];
}
