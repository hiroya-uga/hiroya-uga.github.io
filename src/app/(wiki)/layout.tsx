import { WikiLayout } from '@/components/layouts/WikiLayout';
import { getAllWikiEntries } from '@/libs/wiki';

interface Props {
  children: React.ReactNode;
}

export default function Layout({ children }: Readonly<Props>) {
  const entries = getAllWikiEntries();

  return <WikiLayout entries={entries}>{children}</WikiLayout>;
}
