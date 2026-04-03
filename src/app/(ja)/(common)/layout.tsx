import { CommonLayout } from '@/components/Layout/CommonLayout';

interface Props {
  children: React.ReactNode;
}

export default function Layout({ children }: Readonly<Props>) {
  return <CommonLayout>{children}</CommonLayout>;
}
