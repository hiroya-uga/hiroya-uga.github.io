import Link from 'next/link';
import { Suspense } from 'react';

import { TweetLink } from '@/components/Clickable/TweetLink';
import { PageTitle } from '@/components/structures/PageTitle';
import { Lang } from '@/types/lang';
import { Metadata } from '@/utils/get-metadata';

import { ContrastChecker } from './client';

const i18n = {
  ja: {
    langLink: '* View in English',
    langLinkHref: './en',
  },
  en: {
    langLink: '※ 日本語はこちら',
    langLinkHref: '../',
  },
} satisfies Record<Lang, unknown>;

interface Props {
  lang: Lang;
  metadata: Pick<Metadata, 'pageTitle' | 'following' | 'description'>;
}

export const ToolsContrastCheckerPage = ({ lang, metadata }: Props) => {
  const t = i18n[lang];

  return (
    <div className="mx-auto max-w-[50rem]">
      <PageTitle {...metadata} lang={lang} />

      <div className="bg-secondary px-16PX mx-auto rounded-2xl pb-6 pt-2.5 shadow-md">
        <p className="mb-3 text-right text-xs">
          <Link href={t.langLinkHref}>{t.langLink}</Link>
        </p>
        <div className="@w640:px-16PX">
          <Suspense>
            <ContrastChecker lang={lang} />
          </Suspense>
        </div>
      </div>

      <p className="mt-share-buttons mx-auto grid justify-end">
        <TweetLink hashtags={['WCAG', 'a11y']} lang={lang} />
      </p>
    </div>
  );
};
