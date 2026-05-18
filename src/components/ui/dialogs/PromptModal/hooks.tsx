import { useState } from 'react';

export type PromptData = {
  message: string;
  description?: string;
  defaultValue?: string;
  placeholder?: string;
  yesLabel?: string;
  noLabel?: string;
  yes: (value: string) => void;
  no?: () => void;
};

export const usePrompt = () => {
  const [promptData, setPromptData] = useState<PromptData>({
    message: '',
    yes: () => {},
    no: undefined,
  });

  return { promptData, setPromptData };
};
