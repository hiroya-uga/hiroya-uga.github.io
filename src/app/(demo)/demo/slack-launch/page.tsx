import { Metadata } from 'next';

import { DemoSlackLaunchPage } from '@/components/pages/DemoSlackLaunchPage';

export const metadata: Metadata = {
  title: 'Redirecting… | Slack',
  description: '',
  referrer: 'no-referrer',
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
    },
  },
  alternates: {
    canonical: null,
  },
  icons: {
    icon: '/demo/slack-launch/favicon.ico',
  },
};

export default function Page() {
  return <DemoSlackLaunchPage />;
}
