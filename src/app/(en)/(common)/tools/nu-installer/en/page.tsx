import { ToolsNuInstallerPage } from '@/components/Pages/ToolsNuInstallerPage';
import { getMetadata } from '@/utils/get-metadata';

export const metadata = getMetadata('/tools/nu-installer/en');

export default function Page() {
  return <ToolsNuInstallerPage pageTitle={metadata.pageTitle} lang="en" />;
}
