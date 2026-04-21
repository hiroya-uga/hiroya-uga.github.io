import { JsonLd } from '@/components/Meta';
import { ToolsPage } from '@/components/Pages/ToolsPage';
import { DEFAULT_JSON_LD, URL_ORIGIN } from '@/constants/meta';
import { getMetadata } from '@/utils/get-metadata';

export const metadata = getMetadata('/tools');

const jsonLd = {
  ...DEFAULT_JSON_LD,
  '@type': 'CollectionPage',
  name: metadata.pageTitle,
  description: metadata.description,
  url: `${URL_ORIGIN}/tools`,
};

export default function Page() {
  return (
    <>
      <JsonLd data={jsonLd} />
      <ToolsPage {...metadata} />
    </>
  );
}
