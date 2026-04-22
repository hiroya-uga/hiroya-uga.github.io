import { JsonLd } from '@/components/Meta';
import { ToolsContrastCheckerPage } from '@/components/Pages/ToolsContrastCheckerPage';
import { DEFAULT_JSON_LD, URL_ORIGIN } from '@/constants/meta';
import { getMetadata } from '@/utils/get-metadata';

export const metadata = getMetadata('/tools/contrast-checker/en');

const jsonLd = {
  ...DEFAULT_JSON_LD,
  '@type': 'WebApplication',
  name: metadata.pageTitle,
  description: metadata.description,
  url: `${URL_ORIGIN}/tools/contrast-checker/en`,
  inLanguage: 'en',
};

export default function Page() {
  return (
    <>
      <JsonLd data={jsonLd} />
      <ToolsContrastCheckerPage lang="en" metadata={metadata} />
    </>
  );
}
