import { CommonLayout } from '@/components/Layout/CommonLayout';

export default function Layout({ children }: { children: React.ReactNode }) {
  return <CommonLayout>{children}</CommonLayout>;
}
