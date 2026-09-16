import { describe, expect, it } from 'vitest';

import { SITE_NAME, URL_ORIGIN } from '@/constants/meta';
import { SEO } from '@/constants/seo';
import { getMetadata } from '@/utils/get-metadata';

describe('getMetadata', () => {
  it('トップページはSITE_NAMEをそのままtitleにする', () => {
    expect(getMetadata('/').title).toBe(SITE_NAME);
  });

  it('サブページはタイトルにSITE_NAMEを連結する', () => {
    const metadata = getMetadata('/about');

    expect(metadata.title).toBe(`${SEO['/about'].title} - ${SEO['/about'].afterSubTitle} | ${SITE_NAME}`);
    expect(metadata.description).toBe(SEO['/about'].description);
  });

  it('canonical URLをpathnameから組み立てる', () => {
    expect(getMetadata('/about').alternates?.canonical).toBe(`${URL_ORIGIN}/about`);
  });

  it('SEOに未定義のpathnameは空文字のtitle/descriptionを返す', () => {
    const metadata = getMetadata('/no-such-page' as keyof typeof SEO);

    expect(metadata.pageTitle).toBe('');
    expect(metadata.description).toBe('');
  });
});
