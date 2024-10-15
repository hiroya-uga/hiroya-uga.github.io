import { useId } from 'react';
import { PageTitle } from '@/components/structures/PageTitle';

import { CharacterCountContent } from '@/app/(ja)/(common)/tools/character-count/Client';

const descriptions = [
  '文章の文字数をカウントするツールです。',
  '本文に文字数をチェックしたいテキストを入力してください。原稿用紙換算、段落数も確認できます。',
];

import { getMetadata } from '@/utils/seo';

export const metadata = getMetadata({
  title: '文字数カウント',
  description: descriptions.join(''),
});

export default function Page() {
  const id = useId();

  return (
    <>
      <PageTitle title={metadata.pageTitle}>
        {descriptions.map((description) => {
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
