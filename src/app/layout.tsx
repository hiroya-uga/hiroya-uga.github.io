import { URL_ORIGIN } from '@/constants/meta';
import { Metadata } from 'next';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export const metadata: Metadata = {
  metadataBase: new URL(URL_ORIGIN),
};
