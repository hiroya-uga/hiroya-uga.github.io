import { NotesLayout } from '@/components/layouts/NotesLayout';
import { getAllNotesEntries } from '@/libs/notes';

interface Props {
  children: React.ReactNode;
}

export default function Layout({ children }: Readonly<Props>) {
  const entries = getAllNotesEntries();

  return <NotesLayout entries={entries}>{children}</NotesLayout>;
}
