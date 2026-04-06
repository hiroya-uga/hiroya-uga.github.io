import { PageTitle } from '@/components/structures/PageTitle';
import { Metadata } from '@/utils/get-metadata';
import { NumberPairingClient } from './client';

interface Props {
  metadata: Metadata;
}

export const GamesNumberPairingPage = ({ metadata }: Readonly<Props>) => {
  return (
    <>
      <PageTitle {...metadata} />

      <div className="bg-secondary mx-auto rounded-lg p-8">
        <NumberPairingClient />
      </div>
    </>
  );
};
