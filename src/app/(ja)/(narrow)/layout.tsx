import { NarrowLayout } from '@/components/Layout/NarrowLayout';

interface Props {
  children: React.ReactNode;
}

export default function Layout({ children }: Readonly<Props>) {
  return <NarrowLayout>{children}</NarrowLayout>;
}
