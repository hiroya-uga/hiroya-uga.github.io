import { ToolsNuBookmarkletGeneratorPage } from '@/components/Pages/ToolsNuBookmarkletGeneratorPage';
import { getMetadata } from '@/utils/get-metadata';

export const metadata = getMetadata('/tools/nu-bookmarklet-generator/en');

export default function Page() {
  return <ToolsNuBookmarkletGeneratorPage lang="en" metadata={metadata} />;
}
