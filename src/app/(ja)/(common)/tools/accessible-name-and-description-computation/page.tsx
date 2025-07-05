import { useId } from 'react';

import { AccessibleNameAndDescriptionComputation } from '@/app/(ja)/(common)/tools/accessible-name-and-description-computation/Client';
import { TextLink } from '@/components/Clickable';
import { TweetLink } from '@/components/Clickable/TweetLink';
import { DiscList } from '@/components/List';
import { PageTitle } from '@/components/structures/PageTitle';
import { getMetadata } from '@/utils/get-metadata';

export const metadata = getMetadata('/tools/accessible-name-and-description-computation');

export default function Page() {
  const anchorLinkId = useId();
  const textboxDescId = useId();

  return (
    <>
      <PageTitle title={metadata.pageTitle}>
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

      <p className="mb-2 font-bold sm:mb-1">スクリーンリーダの例：</p>

      <DiscList
        list={[
          {
            key: 'Narrator (for Windows)',
            value: (
              <TextLink href="https://support.microsoft.com/en-us/windows/complete-guide-to-narrator-e4397a0d-ef4f-b386-d8ae-c172f109bdb1">
                Narrator (for Windows)
              </TextLink>
            ),
          },
          {
            key: 'NVDA (for Windows)',
            value: <TextLink href="https://www.nvda.jp/en/index.html">NVDA (for Windows)</TextLink>,
          },
          {
            key: 'VoiceOver (for macOS)',
            value: (
              <TextLink href="https://support.apple.com/guide/voiceover/turn-voiceover-on-or-off-vo2682/mac">
                VoiceOver (for macOS)
              </TextLink>
            ),
          },
          {
            key: 'VoiceOver (for iPadOS)',
            value: (
              <TextLink href="https://support.apple.com/guide/ipad/turn-on-and-practice-voiceover-ipad9a246898/ipados">
                VoiceOver (for iPadOS)
              </TextLink>
            ),
          },
          {
            key: 'VoiceOver (for iOS)',
            value: (
              <TextLink href="https://support.apple.com/guide/iphone/turn-on-and-practice-voiceover-iph3e2e415f/ios">
                VoiceOver (for iOS)
              </TextLink>
            ),
          },
          {
            key: 'TalkBack (for Android)',
            value: (
              <TextLink href="https://support.google.com/accessibility/android/answer/6007100?hl=ja">
                TalkBack (for Android)
              </TextLink>
            ),
          },
        ]}
      />

      <AccessibleNameAndDescriptionComputation anchorLinkId={anchorLinkId} textboxDescId={textboxDescId} />

      <p className="mt-share-buttons mx-auto grid justify-end">
        <TweetLink />
      </p>
    </>
  );
}
