import { RenderTextInReactPlaygroundContent } from '@/app/(ja)/(common)/tools/render-text-in-react/Client';
import { TweetLink } from '@/components/Clickable/TweetLink';
import { PageTitle } from '@/components/structures/PageTitle';
import { getMetadata } from '@/utils/get-metadata';

export const metadata = getMetadata('/tools/render-text-in-react');

export default function Page() {
  return (
    <>
      <PageTitle {...metadata}>
        <p>検証環境：React 19 / macOS 15 + VO / iOS 18 Safari + VO</p>
      </PageTitle>

      <RenderTextInReactPlaygroundContent />

      <p className="mt-share-buttons mx-auto grid justify-end">
        <TweetLink />
      </p>
    </>
  );
}
