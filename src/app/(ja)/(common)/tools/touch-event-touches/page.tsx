import { TouchEventTouchesContent } from '@/app/(ja)/(common)/tools/touch-event-touches/Client';
import { PageTitle } from '@/components/structures/PageTitle';
import { getMetadata } from '@/utils/seo';

export const metadata = getMetadata('/tools/touch-event-touches');

export default function Page() {
  return (
    <>
      <PageTitle title={metadata.pageTitle} description={metadata.description} />
      <TouchEventTouchesContent />
    </>
  );
}
