import { ConfigPage } from '@/components/pages/ConfigPage';
import { getMetadata } from '@/utils/get-metadata';

export const metadata = getMetadata('/config');

export default function Page() {
  return <ConfigPage {...metadata} />;
}
