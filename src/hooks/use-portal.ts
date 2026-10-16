import { NO_SUBSCRIBE } from '@/constants/hooks';
import type { ReactNode } from 'react';
import { useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';

import { DIALOG_PORTAL_ID } from '@/constants/id';

export const usePortal = (id?: string) => {
  const portal = useSyncExternalStore(
    NO_SUBSCRIBE,
    () => document.getElementById(id ?? DIALOG_PORTAL_ID),
    () => null,
  );

  return {
    isPortalReady: portal !== null,
    renderDialog: (children: ReactNode) => (portal === null ? null : createPortal(children, portal)),
  };
};
