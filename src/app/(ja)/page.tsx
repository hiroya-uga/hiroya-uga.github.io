import { HomePage } from '@/components/pages/HomePage';
import { JsonLd } from '@/components/structures/JsonLd';
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
