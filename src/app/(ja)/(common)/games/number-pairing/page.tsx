import { NumberPairingClient } from '@/app/(ja)/(common)/games/number-pairing/Client';
import { PageTitle } from '@/components/structures/PageTitle';
import { getMetadata } from '@/utils/get-metadata';

export const metadata = getMetadata('/games/number-pairing');

export default function Page() {
  return (
    <>
      <PageTitle title={metadata.pageTitle} description={metadata.description} />

      <div className="bg-secondary mx-auto rounded-lg p-8">
        <NumberPairingClient />
      </div>
    </>
  );
}
