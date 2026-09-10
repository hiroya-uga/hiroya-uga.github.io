import { describe, expect, it } from 'vitest';

import { URL_ORIGIN } from '@/constants/meta';
import { SEO } from '@/constants/seo';
import { buildBreadcrumbsFromPath, getAncestorPaths } from '@/utils/breadcrumb';

describe('getAncestorPaths', () => {
  it('階層のあるpathnameを祖先パスの配列に分解する', () => {
    expect(getAncestorPaths('/documents/fantasized-specs')).toStrictEqual([
      '/documents',
      '/documents/fantasized-specs',
    ]);
  });

  it('末尾スラッシュを無視する', () => {
    expect(getAncestorPaths('/documents/fantasized-specs/')).toStrictEqual([
      '/documents',
      '/documents/fantasized-specs',
    ]);
  });

  it('階層のないpathnameは自身のみを返す', () => {
    expect(getAncestorPaths('/about')).toStrictEqual(['/about']);
  });
});

describe('buildBreadcrumbsFromPath', () => {
  it('先頭にHOMEを含める', () => {
    const breadcrumbs = buildBreadcrumbsFromPath('/about');

    expect(breadcrumbs[0]).toStrictEqual({ name: 'HOME', url: `${URL_ORIGIN}/` });
  });

  it('SEOに定義済みのpathnameはtitleとurlを付与する', () => {
    expect(buildBreadcrumbsFromPath('/about')).toStrictEqual([
      { name: 'HOME', url: `${URL_ORIGIN}/` },
      { name: SEO['/about'].title, url: `${URL_ORIGIN}/about/` },
    ]);
  });

  it('SEOに未定義の祖先パスはスキップする', () => {
    expect(buildBreadcrumbsFromPath('/no-such-page')).toStrictEqual([{ name: 'HOME', url: `${URL_ORIGIN}/` }]);
  });
});
