import { AccessibleNameAndDescriptionComputation } from '@/app/(ja)/(common)/tools/accessible-name-and-description-computation/Client';
import { SimpleLinkList } from '@/components/List';
import { PageTitle } from '@/components/structures/PageTitle';
import { Metadata } from '@/types/seo';

import { useId } from 'react';

export const metadata: Metadata = {
  title: 'Playground: Accessible Name and Description Computation',
  description: 'アクセシブルな名前および説明がどう計算されるかをテストするためのページです。',
  twitter: {
    card: 'summary_large_image',
    title: 'Playground: Accessible Name and Description Computation',
    description: 'アクセシブルな名前および説明がどう計算されるかをテストするためのページです。',
  },
};

export default function Page() {
  const anchorLinkId = useId();
  const textboxDescId = useId();

  return (
    <>
      <PageTitle title={metadata.title}>
        <p className="mb-2">
          <b>アクセシブルな名前および説明</b>がどう計算されるかをテストするためのページです。
        </p>
        <p>
          スクリーンリーダによって呼び上げ内容に違いがあります。
          <span className="sm:inline-block">
            実際にスクリーンリーダにテキストフィールドを読ませて、どのように読み上げが変化するかを確認してみましょう。
          </span>
        </p>
      </PageTitle>

      <p className="font-bold mb-2 sm:mb-1">スクリーンリーダの例：</p>

      <SimpleLinkList
        list={[
          {
            href: 'https://support.microsoft.com/en-us/windows/complete-guide-to-narrator-e4397a0d-ef4f-b386-d8ae-c172f109bdb1',
            title: 'Narrator (for Windows)',
          },
          {
            href: 'https://www.nvda.jp/en/index.html',
            title: 'NVDA (for Windows)',
          },
          {
            href: 'https://support.apple.com/guide/voiceover/turn-voiceover-on-or-off-vo2682/mac',
            title: 'VoiceOver (for macOS)',
          },
          {
            href: 'https://support.apple.com/guide/ipad/turn-on-and-practice-voiceover-ipad9a246898/ipados',
            title: 'VoiceOver (for iPadOS)',
          },
          {
            href: 'https://support.apple.com/guide/iphone/turn-on-and-practice-voiceover-iph3e2e415f/ios',
            title: 'VoiceOver (for iOS)',
          },
          {
            href: 'https://support.google.com/accessibility/android/answer/6007100?hl=ja',
            title: 'TalkBack (for Android)',
          },
        ]}
      />

      <AccessibleNameAndDescriptionComputation anchorLinkId={anchorLinkId} textboxDescId={textboxDescId} />
    </>
  );
}
