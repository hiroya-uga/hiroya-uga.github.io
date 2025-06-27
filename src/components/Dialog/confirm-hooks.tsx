import { useState } from 'react';

export type ConfirmData = {
  message: string;
  children?: React.ReactNode;
  yes: () => void;
  no?: () => void;
};

export const useConfirm = () => {
  const [confirmData, setConfirmData] = useState<ConfirmData>({
    message: '',
    children: undefined,
    yes: () => {},
    no: undefined,
  });

  return {
    confirmData,
    setConfirmData,
  };
};
