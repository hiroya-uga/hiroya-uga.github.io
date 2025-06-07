import '@/app/globals.css';

import { Metadata } from 'next';

import { Console } from '@/components/Jokes';
import { URL_ORIGIN } from '@/constants/meta';
import 'highlight.js/styles/a11y-dark.css';

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
