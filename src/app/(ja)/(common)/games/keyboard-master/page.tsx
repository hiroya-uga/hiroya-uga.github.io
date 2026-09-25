import { GamesKeyboardMasterPage } from '@/components/pages/GamesKeyboardMasterPage';
import { getMetadata } from '@/utils/get-metadata';

export const metadata = getMetadata('/games/keyboard-master');

export default function Page() {
  return <GamesKeyboardMasterPage metadata={metadata} />;
}
