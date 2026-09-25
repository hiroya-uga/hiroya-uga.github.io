import { ConfirmData } from '@/components/ui/dialogs/Confirm/Confirm';
import { useState } from 'react';

export const useConfirm = () => {
  const [confirmData, setConfirmData] = useState<ConfirmData | null>(null);

  return {
    confirmData,
    setConfirmData,
    closeConfirm: () => {
      setConfirmData(null);
    },
  };
};
