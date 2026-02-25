import { KeepAwakeClient } from '@/app/(ja)/(common)/tools/screen-wake-lock/Client';
import { TweetLink } from '@/components/Clickable/TweetLink';
import { NoteList } from '@/components/List';
import { PageTitle } from '@/components/structures/PageTitle';
import { getMetadata } from '@/utils/get-metadata';

export const metadata = getMetadata('/tools/screen-wake-lock');

export default function Page() {
  return (
    <>
      <PageTitle {...metadata}>
        <p className="mt-paragraph">
          「スリープ防止を開始する」ボタンを押下し、このタブをアクティブにしたままにしてください<sup>※</sup>。
        </p>
      </PageTitle>
      <KeepAwakeClient />
      <div className="mt-14 sm:mt-20">
        <NoteList
          list={[
            'バッテリー消費が増える場合があります。',
            'バッテリー残量が少ない場合や、省電力モードになっている場合など、スリープ防止に失敗する可能性があります。',
          ]}
        />
      </div>
      <p className="mt-share-buttons mx-auto grid justify-end">
        <TweetLink />
      </p>
    </>
  );
}
