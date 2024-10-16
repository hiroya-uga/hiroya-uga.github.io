import { useId } from 'react';
import { PageTitle } from '@/components/structures/PageTitle';

import { CharacterCountContent } from '@/app/(ja)/(common)/tools/character-count/Client';

import { getMetadata } from '@/utils/seo';

export const metadata = getMetadata('/tools/character-count');

export default function Page() {
  const id = useId();

  return (
    <>
      <PageTitle title={metadata.pageTitle}>
        {metadata.description.split('\n').map((description) => {
          return <p key={description}>{description}</p>;
        })}

        <p>
          <small>※ 入力された値はブラウザに記録されますが、収集されたり外部に送信されることはありません。</small>
        </p>
      </PageTitle>

      <CharacterCountContent id={id} />
    </>
  );
}
