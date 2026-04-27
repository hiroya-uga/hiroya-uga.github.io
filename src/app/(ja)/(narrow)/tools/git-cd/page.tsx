import { ToolsGitCdPage } from '@/components/pages/ToolsGitCdPage';
import { JsonLd } from '@/components/structures/JsonLd';
import { DEFAULT_JSON_LD, URL_ORIGIN } from '@/constants/meta';
import { getMetadata } from '@/utils/get-metadata';

export const metadata = getMetadata('/tools/git-cd');

const jsonLd = {
  ...DEFAULT_JSON_LD,
  '@type': 'SoftwareApplication',
  name: metadata.pageTitle,
  description: metadata.description,
  url: `${URL_ORIGIN}/tools/git-cd`,
};

export default function Page() {
  return (
    <>
      <JsonLd data={jsonLd} />
      <ToolsGitCdPage {...metadata} inLanguage="ja" />
    </>
  );
}
