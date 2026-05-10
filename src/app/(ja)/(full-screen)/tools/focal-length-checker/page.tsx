import { ToolsFocalLengthCheckerPage } from '@/components/pages/ToolsFocalLengthCheckerPage';
import { getMetadata } from '@/utils/get-metadata';

import { GlobalFooter } from '@/components/structures/GlobalFooter';
import { GlobalHeader } from '@/components/structures/GlobalHeader';
import { JsonLd } from '@/components/structures/JsonLd';
import { DEFAULT_JSON_LD, URL_ORIGIN } from '@/constants/meta';

export const metadata = {
  ...getMetadata('/tools/focal-length-checker'),
  manifest: '/tools/focal-length-checker/manifest.json',
  icons: {
    apple: '/tools/focal-length-checker/icon-192.png',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent' as const,
    title: '焦点距離チェッカー',
  },
};

const jsonLd = {
  ...DEFAULT_JSON_LD,
  '@type': 'SoftwareApplication',
  name: metadata.pageTitle,
  description: metadata.description,
  url: `${URL_ORIGIN}/tools/focal-length-checker`,
};

export default function Page() {
  return (
    <>
      <JsonLd data={jsonLd} />
      <div className="grid min-h-dvh grid-cols-1 grid-rows-[auto_1fr_auto]">
        <GlobalHeader />

        <main className="@container">
          <ToolsFocalLengthCheckerPage {...metadata} />
        </main>

        <GlobalFooter />
      </div>
    </>
  );
}
