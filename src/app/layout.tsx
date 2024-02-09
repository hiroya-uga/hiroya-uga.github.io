import '@/app/globals.css';
import { URL_ORIGIN } from '@/constants/meta';

import { Metadata } from 'next';

export default function DocumentLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export const metadata: Metadata = {
  metadataBase: new URL(URL_ORIGIN),
};
