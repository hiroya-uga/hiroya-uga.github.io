import { Metadata } from 'next';

import { DefaultRootLayout } from '@/components/structures/DefaultRootLayout';
import { URL_ORIGIN } from '@/constants/meta';

export default function JaRootLayout({ children }: { children: React.ReactNode }) {
  return <DefaultRootLayout lang="ja">{children}</DefaultRootLayout>;
}

export const metadata: Metadata = {
  metadataBase: new URL(URL_ORIGIN),
};
