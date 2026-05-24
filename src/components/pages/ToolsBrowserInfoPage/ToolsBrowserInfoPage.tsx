import { PageTitle } from '@/components/structures/PageTitle';
import { ShareSection } from '@/components/structures/ShareSection';
import { Lang } from '@/types/lang';
import { Metadata } from '@/utils/get-metadata';
import { ToolsBrowserInfoClient } from './client';
import { toolsBrowserInfoLocales } from './locales';

interface Props {
  metadata: Pick<Metadata, 'pageTitle' | 'following' | 'description'>;
  lang?: Lang;
}

export const ToolsBrowserInfoPage = ({ metadata, lang = 'ja' }: Readonly<Props>) => {
  const t = toolsBrowserInfoLocales[lang];

  return (
    <>
      <PageTitle {...metadata} lang={lang} shouldShowOtherLanguageLink>
        <p className="mt-paragraph">{t.pageDescription1}</p>
        <p>{t.pageDescription2}</p>
      </PageTitle>
      <ToolsBrowserInfoClient lang={lang} />
      <ShareSection />
    </>
  );
};
