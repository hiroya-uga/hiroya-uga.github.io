import { Metadata } from 'next';

import { DefaultRootLayout } from '@/components/structures/DefaultRootLayout';
import { URL_ORIGIN } from '@/constants/meta';

export default function EnRootLayout({ children }: { children: React.ReactNode }) {
  return <DefaultRootLayout lang="en">{children}</DefaultRootLayout>;
}

export const metadata: Metadata = {
  metadataBase: new URL(URL_ORIGIN),
};
