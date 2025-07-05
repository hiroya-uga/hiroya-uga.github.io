import { KeyboardEventContent } from '@/app/(ja)/(wide-content)/tools/keyboard-event/Client';
import { TweetLink } from '@/components/Clickable/TweetLink';
import { PageTitle } from '@/components/structures/PageTitle';
import { getMetadata } from '@/utils/get-metadata';

export const metadata = getMetadata('/tools/keyboard-event');

export default function Page() {
  return (
    <>
      <PageTitle title={metadata.pageTitle} description={metadata.description} shouldShowPrivacyPolicyMessage />
      <KeyboardEventContent />
      <p className="mt-share-buttons mx-auto grid justify-end">
        <TweetLink />
      </p>
    </>
  );
}
