import { CookieConsentDialog } from '@/components/ui/dialogs/CookieConsentDialog';
import { Suspense } from 'react';

interface Props {
  children: React.ReactNode;
}

export default function JapaneseLayout({ children }: Readonly<Props>) {
  return (
    <>
      {children}

      <Suspense>
        <CookieConsentDialog lang="ja" />
      </Suspense>
    </>
  );
}
