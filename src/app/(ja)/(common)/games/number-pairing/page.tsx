import { GamesNumberPairingPage } from '@/components/pages/GamesNumberPairingPage';
import { getMetadata } from '@/utils/get-metadata';

export const metadata = getMetadata('/games/number-pairing');

export default function Page() {
  return <GamesNumberPairingPage metadata={metadata} />;
}
