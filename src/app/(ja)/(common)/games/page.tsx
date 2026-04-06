import { GamesPage } from '@/components/Pages/GamesPage';
import { getMetadata } from '@/utils/get-metadata';

export const metadata = getMetadata('/games');

export default function Page() {
  return <GamesPage metadata={metadata} />;
}
