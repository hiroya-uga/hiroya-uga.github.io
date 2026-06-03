import type { NotesEntry } from './generator';

export const compareNotesEntries = (a: NotesEntry, b: NotesEntry): number => {
  const ai = a.frontmatter.sortIndex;
  const bi = b.frontmatter.sortIndex;
  const titleOrder = () => a.frontmatter.title.localeCompare(b.frontmatter.title, 'ja');

  if (ai === -1 && bi !== -1) return 1;
  if (ai !== -1 && bi === -1) return -1;
  if (ai === -1 && bi === -1) return titleOrder();

  if (ai !== undefined && bi !== undefined) return bi - ai;
  if (ai !== undefined) return -1;
  if (bi !== undefined) return 1;
  return titleOrder();
};
