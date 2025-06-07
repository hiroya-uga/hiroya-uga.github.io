import styles from '@/app/(en)/(specs)/layout.module.css';
import clsx from 'clsx';

import CommonLayout from '@/app/(ja)/(common)/layout';

export default function SpecsLayout({ children }: { children: React.ReactNode }) {
  return (
    <CommonLayout>
      <div className={clsx([styles.layout, 'px-5 sm:px-6'])}>{children}</div>
    </CommonLayout>
  );
}
