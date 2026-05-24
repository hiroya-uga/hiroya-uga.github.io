import { WideContentLayout } from '@/components/layouts/WideContentLayout';

interface Props {
  children: React.ReactNode;
}

export default function Layout({ children }: Readonly<Props>) {
  return <WideContentLayout>{children}</WideContentLayout>;
}
