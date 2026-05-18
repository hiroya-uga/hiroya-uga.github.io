'use client';

import { useState } from 'react';

export const useUnicodePlaygroundState = (initialValue: string) => {
  const [value, setValue] = useState(initialValue);
  const [stepIndex, setStepIndex] = useState([...value].length - 1);
  const [multiline, setMultiline] = useState(false);

  const applyValue = (nextValue: string) => {
    setValue(nextValue);
    setStepIndex(Math.max(0, [...nextValue].length - 1));

    if (nextValue.includes('\n') || nextValue.includes('\r')) {
      setMultiline(true);
    }
  };

  return { value, stepIndex, setStepIndex, multiline, setMultiline, applyValue };
};
