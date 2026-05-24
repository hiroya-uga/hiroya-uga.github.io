import { ToolsBrowserInfoPage } from '@/components/pages/ToolsBrowserInfoPage';
import { JsonLd } from '@/components/structures/JsonLd';
import { DEFAULT_JSON_LD, URL_ORIGIN } from '@/constants/meta';
import { getMetadata } from '@/utils/get-metadata';

export const metadata = getMetadata('/tools/browser-info/en');

const jsonLd = {
  ...DEFAULT_JSON_LD,
  '@type': 'WebApplication',
  name: metadata.pageTitle,
  description: metadata.description,
  url: `${URL_ORIGIN}/tools/browser-info/en`,
  inLanguage: 'en',
};

export default function Page() {
  return (
    <>
      <JsonLd data={jsonLd} />
      <ToolsBrowserInfoPage metadata={metadata} lang="en" />
    </>
  );
}
