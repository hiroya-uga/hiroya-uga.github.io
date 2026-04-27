import { GamesSimpleBlockBreakerPage } from '@/components/pages/GamesSimpleBlockBreakerPage';
import { getMetadata } from '@/utils/get-metadata';

export const metadata = getMetadata('/games/simple-block-breaker');

export default function Page() {
  return <GamesSimpleBlockBreakerPage metadata={metadata} />;
}
