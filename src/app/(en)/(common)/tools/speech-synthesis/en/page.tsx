import { ToolsSpeechSynthesisPage } from '@/components/pages/ToolsSpeechSynthesisPage';
import { JsonLd } from '@/components/structures/JsonLd';
import { DEFAULT_JSON_LD, URL_ORIGIN } from '@/constants/meta';
import { getMetadata } from '@/utils/get-metadata';

export const metadata = getMetadata('/tools/speech-synthesis/en');

const jsonLd = {
  ...DEFAULT_JSON_LD,
  '@type': 'WebApplication',
  name: metadata.pageTitle,
  description: metadata.description,
  url: `${URL_ORIGIN}/tools/speech-synthesis/en`,
  inLanguage: 'en',
};

export default function Page() {
  return (
    <>
      <JsonLd data={jsonLd} />
      <ToolsSpeechSynthesisPage lang="en" metadata={metadata} />
    </>
  );
}
