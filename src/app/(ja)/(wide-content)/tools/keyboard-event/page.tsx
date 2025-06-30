import { KeyboardEventContent } from '@/app/(ja)/(wide-content)/tools/keyboard-event/Client';
import { PageTitle } from '@/components/structures/PageTitle';
import { getMetadata } from '@/utils/get-metadata';

export const metadata = getMetadata('/tools/keyboard-event');

export default function Page() {
  return (
    <>
      <PageTitle title={metadata.pageTitle} description={metadata.description} shouldShowPrivacyPolicyMessage />
      <KeyboardEventContent />
    </>
  );
}
