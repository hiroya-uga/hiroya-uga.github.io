import { NotesLayout } from '@/components/layouts/NotesLayout';
import { CookieConsentDialog } from '@/components/ui/dialogs/CookieConsentDialog';
import { getAllNotesEntries } from '@/libs/notes';
import { Suspense } from 'react';

interface Props {
  children: React.ReactNode;
}

export default function Layout({ children }: Readonly<Props>) {
  const entries = getAllNotesEntries();

  return (
    <>
      <NotesLayout entries={entries}>{children}</NotesLayout>
      <Suspense>
        <CookieConsentDialog lang="ja" />
      </Suspense>
    </>
  );
}
