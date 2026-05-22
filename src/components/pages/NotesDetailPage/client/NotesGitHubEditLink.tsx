'use client';

import { GITHUB_NOTES_REPOSITORY } from '@/constants/meta';
import { usePathname } from 'next/navigation';

export const NotesGitHubEditLink = () => {
  const pathname = usePathname();

  if (!pathname.startsWith('/notes/')) {
    return null;
  }

  const href = `${GITHUB_NOTES_REPOSITORY}/edit/main${pathname.replace(/^\/notes\//, '/')}index.md`;

  return (
    <p>
      <a href={href}>編集</a>
    </p>
  );
};
