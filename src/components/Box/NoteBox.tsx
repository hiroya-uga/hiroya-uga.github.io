import { ReactNode } from 'react';

export const NoteBox = ({ title = 'Note', children }: { title?: string; children: ReactNode }) => {
  return (
    <aside className="rounded-md bg-green-50 border border-gray-400 p-4">
      <h3 className="font-bold text-lg text-green-800 mb-1">💡 {title}</h3>
      {children}
    </aside>
  );
};
