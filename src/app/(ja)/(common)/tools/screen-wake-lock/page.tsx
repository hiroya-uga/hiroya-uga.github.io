import { KeepAwakeClient } from '@/app/(ja)/(common)/tools/screen-wake-lock/Client';
import { JsonLd } from '@/components/structures/JsonLd';
import { PageTitle } from '@/components/structures/PageTitle';
import { ShareSection } from '@/components/structures/ShareSection';
import { NoteList } from '@/components/ui/lists/NoteList';
import { DEFAULT_JSON_LD, URL_ORIGIN } from '@/constants/meta';
import { getMetadata } from '@/utils/get-metadata';

export const metadata = getMetadata('/tools/screen-wake-lock');

const jsonLd = {
  ...DEFAULT_JSON_LD,
  '@type': 'WebApplication',
  name: metadata.pageTitle,
  description: metadata.description,
  url: `${URL_ORIGIN}/tools/screen-wake-lock`,
};

export default function Page() {
  return (
    <>
      <JsonLd data={jsonLd} />
      <PageTitle {...metadata}>
        <p className="mt-paragraph">
          「スリープ防止を開始する」ボタンを押下し、このタブをアクティブにしたままにしてください<sup>※</sup>。
        </p>
      </PageTitle>
      <KeepAwakeClient />
      <div className="w640:mt-20 mt-14">
        <NoteList
          list={[
            'バッテリー消費が増える場合があります。',
            'バッテリー残量が少ない場合や、省電力モードになっている場合など、スリープ防止に失敗する可能性があります。',
          ]}
        />
      </div>
      <ShareSection />
    </>
  );
}
