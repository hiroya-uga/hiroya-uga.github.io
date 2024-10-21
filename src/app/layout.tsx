import '@/app/globals.css';
import { Metadata } from 'next';
import { Console } from '@/components/Jokes/Console';
import { URL_ORIGIN } from '@/constants/meta';

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
