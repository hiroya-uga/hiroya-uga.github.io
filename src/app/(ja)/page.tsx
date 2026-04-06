import { JsonLd } from '@/components/Meta';
import { HomePage } from '@/components/Pages/HomePage';
import { DEFAULT_JSON_LD } from '@/constants/meta';
import { getMetadata } from '@/utils/get-metadata';

export const metadata = getMetadata('/');

export default function Page() {
  return (
    <>
      <JsonLd data={DEFAULT_JSON_LD} />
      <HomePage />
    </>
  );
}
