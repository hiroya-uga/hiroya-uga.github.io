import { ToolsNuInstallerPage } from '@/components/Pages/ToolsNuInstallerPage';
import { DEFAULT_JSON_LD, URL_ORIGIN } from '@/constants/meta';
import { getMetadata } from '@/utils/get-metadata';

export const metadata = getMetadata('/tools/nu-installer/en');

const jsonLd = {
  ...DEFAULT_JSON_LD,
  '@type': 'SoftwareApplication',
  name: metadata.pageTitle,
  description: metadata.description,
  url: `${URL_ORIGIN}/tools/nu-installer/en`,
  inLanguage: 'en',
};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ToolsNuInstallerPage pageTitle={metadata.pageTitle} lang="en" />
    </>
  );
}
