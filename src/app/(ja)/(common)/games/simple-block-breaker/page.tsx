import { GamesSimpleBlockBreakerPage } from '@/components/Pages/GamesSimpleBlockBreakerPage';
import { getMetadata } from '@/utils/get-metadata';

export const metadata = getMetadata('/games/simple-block-breaker');

export default function Page() {
  return <GamesSimpleBlockBreakerPage metadata={metadata} />;
}
