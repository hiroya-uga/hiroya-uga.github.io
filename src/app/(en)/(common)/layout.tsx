import { CommonLayout } from '@/components/layouts/CommonLayout';

interface Props {
  children: React.ReactNode;
}

export default function Layout({ children }: Readonly<Props>) {
  return <CommonLayout>{children}</CommonLayout>;
}
