import { TouchEventTouchesContent } from '@/app/(ja)/(common)/tools/touch-event-touches/Client';
import { PageTitle } from '@/components/structures/PageTitle';
import { TweetLink } from '@/components/structures/TweetLink';
import { getMetadata } from '@/utils/get-metadata';

export const metadata = getMetadata('/tools/touch-event-touches');

export default function Page() {
  return (
    <>
      <PageTitle title={metadata.pageTitle} description={metadata.description} />
      <TouchEventTouchesContent />
      <p className="mt-share-buttons mx-auto grid justify-end">
        <TweetLink />
      </p>
    </>
  );
}
