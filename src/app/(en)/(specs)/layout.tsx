import '@/app/(en)/(specs)/common.css';

import CommonLayout from '@/app/(ja)/(common)/layout';

export default function SpecsLayout({ children }: { children: React.ReactNode }) {
  return <CommonLayout>{children}</CommonLayout>;
}
