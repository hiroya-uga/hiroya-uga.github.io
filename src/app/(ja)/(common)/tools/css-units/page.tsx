import { useId } from 'react';

import { CSSUnitsContent } from '@/app/(ja)/(common)/tools/css-units/Client';
import { TweetLink } from '@/components/Clickable/TweetLink';
import { PageTitle } from '@/components/structures/PageTitle';
import { getMetadata } from '@/utils/get-metadata';

export const metadata = getMetadata('/tools/css-units');

export default function Page() {
  const id = useId();

  return (
    <>
      <PageTitle title={metadata.pageTitle}>
        <p>{metadata.description}</p>
        <p className="mb-2">
          <a href={`#${id}`}>画面下部のスライダー</a>を動かして値を変化させてみましょう。
        </p>
        <p>
          参考：<a href="https://drafts.csswg.org/css-values/">CSS Values and Units Module</a>
        </p>
      </PageTitle>
      <CSSUnitsContent id={id} />
      <p className="mt-share-buttons mx-auto grid justify-end">
        <TweetLink />
      </p>
    </>
  );
}
