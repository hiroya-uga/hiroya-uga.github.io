'use client';

// import { GITHUB_REPOSITORY } from '@/constants/meta';
import { usePathname } from 'next/navigation';

export const NotesGitHubEditLink = () => {
  const pathname = usePathname();

  if (!pathname.startsWith('/notes/')) {
    return null;
  }

  // const href = `${GITHUB_REPOSITORY}/edit/main${pathname}/index.md`;

  return (
    <p>
      {/* <a href={href}>編集</a> */}
      <a aria-disabled="true">編集</a>
    </p>
  );
};
