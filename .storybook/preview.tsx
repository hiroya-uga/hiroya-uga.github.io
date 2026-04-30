import { DIALOG_PORTAL_ID, SVG_PORTAL_ID } from '@/constants/id';
import type { Preview } from '@storybook/nextjs-vite';
import { useEffect } from 'react';

import '../src/app/globals.css';

const StorybookPortalDecorator = ({ Story }: Readonly<{ Story: React.ComponentType }>) => {
  useEffect(() => {
    const body = document.body;
    const dialogPortal = document.getElementById(DIALOG_PORTAL_ID) ?? document.createElement('div');
    const svgPortal = document.getElementById(SVG_PORTAL_ID) ?? document.createElement('div');

    dialogPortal.id = DIALOG_PORTAL_ID;
    svgPortal.id = SVG_PORTAL_ID;
    svgPortal.hidden = true;

    if (dialogPortal.parentElement === null) {
      body.append(dialogPortal);
    }

    if (svgPortal.parentElement === null) {
      body.append(svgPortal);
    }
  }, []);

  return <Story />;
};

const preview: Preview = {
  decorators: [(Story) => <StorybookPortalDecorator Story={Story} />],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      config: {},
    },
    nextjs: {
      appDirectory: true,
    },
  },
};

export default preview;
