import { PageTitle } from '@/components/structures/PageTitle';

import { SimpleBlockBreaker } from '@/app/(ja)/(common)/games/simple-block-breaker/Client';
import { TweetLink } from '@/components/Clickable/TweetLink';
import { Fps } from '@/components/Meta';
import { getMetadata } from '@/utils/get-metadata';

export const metadata = getMetadata('/games/simple-block-breaker');

export default function BlockBreakerPage() {
  return (
    <>
      <PageTitle title={metadata.pageTitle} following={metadata.following} description={metadata.description} />
      <div className="rounded-lg bg-gray-900 text-white">
        <p className="px-8 pb-10 pt-7 text-right font-mono text-[#a4a4a4]">
          FPS: <Fps />
        </p>
        <div className="mx-auto pb-8 landscape:w-[80%]">
          <SimpleBlockBreaker width={960} height={1280} />
        </div>
      </div>
      <p className="mt-share-buttons mx-auto grid justify-end">
        <TweetLink />
      </p>
    </>
  );
}
