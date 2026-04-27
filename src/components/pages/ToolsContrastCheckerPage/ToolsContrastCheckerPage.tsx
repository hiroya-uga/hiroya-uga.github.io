import { Suspense } from 'react';

import { PageTitle } from '@/components/structures/PageTitle';
import { TweetLink } from '@/components/structures/TweetLink';
import { LangSwitchLink } from '@/components/ui/features/LangSwitchLink';
import { Lang } from '@/types/lang';
import { Metadata } from '@/utils/get-metadata';

import { ContrastChecker } from './client';

interface Props {
  lang: Lang;
  metadata: Pick<Metadata, 'pageTitle' | 'following' | 'description'>;
}

export const ToolsContrastCheckerPage = ({ lang, metadata }: Props) => {
  return (
    <div className="mx-auto max-w-[50rem]">
      <PageTitle {...metadata} lang={lang} />

      <div className="bg-secondary px-16PX mx-auto rounded-2xl pb-6 pt-2.5 shadow-md">
        <p className="mb-3 text-right text-xs">
          <LangSwitchLink lang={lang} />
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
