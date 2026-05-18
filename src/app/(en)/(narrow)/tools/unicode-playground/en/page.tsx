import { ToolsUnicodePlaygroundPage } from '@/components/pages/ToolsUnicodePlaygroundPage';
import { JsonLd } from '@/components/structures/JsonLd';
import { DEFAULT_JSON_LD, URL_ORIGIN } from '@/constants/meta';
import { getMetadata } from '@/utils/get-metadata';

export const metadata = getMetadata('/tools/unicode-playground/en');

const jsonLd = {
  ...DEFAULT_JSON_LD,
  '@type': 'SoftwareApplication',
  name: metadata.pageTitle,
  description: metadata.description,
  url: `${URL_ORIGIN}/tools/unicode-playground/en`,
  inLanguage: 'en',
};

export default function Page() {
  return (
    <>
      <JsonLd data={jsonLd} />
      <ToolsUnicodePlaygroundPage metadata={metadata} lang="en" />
    </>
  );
}
