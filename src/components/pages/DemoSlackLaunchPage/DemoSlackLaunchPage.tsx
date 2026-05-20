import { Suspense } from 'react';

import clsx from 'clsx';
import { Lato } from 'next/font/google';
import Image from 'next/image';

import { DemoSlackLaunchContent } from '@/components/pages/DemoSlackLaunchPage/client';

const lato = Lato({
  subsets: ['latin'],
  weight: ['400', '700', '900'],
  display: 'swap',
});

export const DemoSlackLaunchPage = () => {
  return (
    <div className={clsx(lato.className, 'px-12PX min-h-dvh bg-white text-[#1d1c1d]')} data-no-scrollbar-gutter="true">
      <header className="w640:pt-48px w640:px-0 w640:pb-40px w640:mx-auto w-fit p-[16px_0_16px_20px]">
        <h1>
          <Image
            src="/demo/slack-launch/slack_logo.svg"
            alt="Slack"
            width={102}
            height={26}
            className="h-26px block w-auto"
            priority
          />
        </h1>
      </header>

      <Suspense>
        <DemoSlackLaunchContent />
      </Suspense>
    </div>
  );
};
