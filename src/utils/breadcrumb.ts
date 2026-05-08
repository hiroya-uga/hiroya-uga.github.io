import { URL_ORIGIN } from '@/constants/meta';
import { SEO } from '@/constants/seo';

export type BreadcrumbItem = { name: string; url: string };

export const getAncestorPaths = (pathname: string): string[] => {
  const segments = pathname.replace(/^\/|\/$/g, '').split('/');
  return segments.map((_, index) => '/' + segments.slice(0, index + 1).join('/'));
};

export const buildBreadcrumbsFromPath = (pathname: string): BreadcrumbItem[] => {
  const items: BreadcrumbItem[] = [{ name: 'HOME', url: `${URL_ORIGIN}/` }];

  for (const path of getAncestorPaths(pathname)) {
    if (path in SEO) {
      items.push({ name: SEO[path].title, url: `${URL_ORIGIN}${path}/` });
    }
  }

  return items;
};
