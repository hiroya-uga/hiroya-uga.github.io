import { TweetLink } from '@/components/Clickable/TweetLink';
import { Fps } from '@/components/Meta';
import { PageTitle } from '@/components/structures/PageTitle';
import { Metadata } from '@/utils/get-metadata';
import { Suspense } from 'react';
import { SimpleBlockBreaker } from './client';

interface Props {
  metadata: Metadata;
}

export const GamesSimpleBlockBreakerPage = ({ metadata }: Readonly<Props>) => {
  return (
    <>
      <PageTitle {...metadata} />

      <div className="rounded-lg bg-gray-900 text-white">
        <p className="px-8 pb-10 pt-7 text-right font-mono text-[#a4a4a4]">
          FPS: <Fps />
        </p>
        <div className="mx-auto pb-8 landscape:w-[80%]">
          <Suspense>
            <SimpleBlockBreaker width={960} height={1280} />
          </Suspense>
        </div>
      </div>

      <p className="mt-share-buttons mx-auto grid justify-end">
        <TweetLink />
      </p>
    </>
  );
};
