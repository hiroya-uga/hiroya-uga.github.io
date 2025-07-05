import { useId } from 'react';

import { CharacterCountContent } from '@/app/(ja)/(common)/tools/character-count/Client';
import { TweetLink } from '@/components/Clickable/TweetLink';
import { PageTitle } from '@/components/structures/PageTitle';
import { getMetadata } from '@/utils/get-metadata';

export const metadata = getMetadata('/tools/character-count');

export default function Page() {
  const id = useId();

  return (
    <>
      <PageTitle title={metadata.pageTitle} description={metadata.description} shouldShowPrivacyPolicyMessage>
        <p>本文に文字数をチェックしたいテキストを入力してください。</p>
      </PageTitle>
      <CharacterCountContent id={id} />
      <p className="mt-share-buttons mx-auto grid justify-end">
        <TweetLink />
      </p>
    </>
  );
}
