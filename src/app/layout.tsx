import '@/app/globals.css';
import { Console } from '@/components/Jokes/Console';
import { URL_ORIGIN } from '@/constants/meta';

import { Metadata } from 'next';

export default function DocumentLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Console />
      {children}
    </>
  );
}

export const metadata: Metadata = {
  metadataBase: new URL(URL_ORIGIN),
};
