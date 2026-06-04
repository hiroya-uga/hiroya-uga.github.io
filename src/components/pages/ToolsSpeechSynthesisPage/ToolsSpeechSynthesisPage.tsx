import { PageTitle } from '@/components/structures/PageTitle';
import { ShareSection } from '@/components/structures/ShareSection';
import { Lang } from '@/types/lang';
import { Metadata } from '@/utils/get-metadata';

import { SpeechSynthesisPlayground } from './client';

interface Props {
  lang: Lang;
  metadata: Pick<Metadata, 'pageTitle' | 'description'>;
}

export const ToolsSpeechSynthesisPage = ({ lang, metadata }: Props) => {
  return (
    <>
      <PageTitle {...metadata} lang={lang} shouldShowPrivacyPolicyMessage shouldShowOtherLanguageLink />
      <SpeechSynthesisPlayground lang={lang} />
      <ShareSection lang={lang} />
    </>
  );
};
