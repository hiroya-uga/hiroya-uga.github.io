import { JsonLd } from '@/components/Meta';
import { ToolsVnuxPage } from '@/components/Pages/ToolsVnuxPage';
import { DEFAULT_JSON_LD, URL_ORIGIN } from '@/constants/meta';
import { getMetadata } from '@/utils/get-metadata';

export const metadata = getMetadata('/tools/vnux');

const jsonLd = {
  ...DEFAULT_JSON_LD,
  '@type': 'SoftwareApplication',
  name: metadata.pageTitle,
  description: metadata.description,
  url: `${URL_ORIGIN}/tools/vnux`,
};

export default function Page() {
  return (
    <>
      <JsonLd data={jsonLd} />
      <ToolsVnuxPage pageTitle={metadata.pageTitle} following={metadata.following} lang="ja" />
    </>
  );
}
