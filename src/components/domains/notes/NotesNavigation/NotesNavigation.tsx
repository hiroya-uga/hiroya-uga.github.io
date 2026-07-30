import { NotesSidebarNav } from '@/components/layouts/NotesLayout/client/NotesSidebarNav';
import type { NotesEntry } from '@/libs/notes';

interface Props {
  entries: NotesEntry[];
  id?: string;
}

export const NotesNavigation = ({ entries, id,  }: Props) => {
  return (
    <nav id={id}  aria-label="Wikiʻoleナビゲーション">
      <NotesSidebarNav entries={entries} />
    </nav>
  );
};
