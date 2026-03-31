import { ToolsNuBookmarkletGeneratorPage } from '@/components/Pages/ToolsNuBookmarkletGeneratorPage';
import { DEFAULT_JSON_LD, URL_ORIGIN } from '@/constants/meta';
import { getMetadata } from '@/utils/get-metadata';

export const metadata = getMetadata('/tools/nu-bookmarklet-generator');

const jsonLd = {
  ...DEFAULT_JSON_LD,
  '@type': 'WebApplication',
  name: metadata.pageTitle,
  description: metadata.description,
  url: `${URL_ORIGIN}/tools/nu-bookmarklet-generator`,
};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ToolsNuBookmarkletGeneratorPage lang="ja" metadata={metadata} />
    </>
  );
}
