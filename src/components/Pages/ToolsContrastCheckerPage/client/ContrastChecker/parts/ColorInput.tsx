'use client';

import { formatHexString } from '@/utils/formatter';
import { useEffect, useRef, useState } from 'react';

interface Props {
  id: string;
  label: string;
  value: string;
  handleChange: (hex: string) => void;
}

export const ColorInput = ({ id, label, value, handleChange }: Readonly<Props>) => {
  const [text, setText] = useState(value);
  const isEditingRef = useRef(false);

  const updateValue = (newText: string) => {
    const expanded = formatHexString(newText);

    if (expanded) {
      handleChange(expanded);
    }
  };

  const onChangeColorPicker = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.currentTarget.value;
    updateValue(newColor);
  };

  const onChangeTextValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newText = e.currentTarget.value;
    setText(newText);
    updateValue(newText);
  };

  const labelId = `${id}-label`;

  useEffect(() => {
    if (isEditingRef.current) {
      return;
    }

    setText(value);
  }, [value]);

  return (
    <>
      <p>
        <label id={labelId} htmlFor={id} className="block text-sm font-bold leading-snug">
          {label}
        </label>
      </p>

      <p className="mt-2 grid grid-cols-[auto_1fr] gap-3">
        <span className="relative block aspect-square">
          <input
            type="color"
            value={value}
            onChange={onChangeColorPicker}
            aria-labelledby={labelId}
            className="border-primary transition-bg absolute inset-0 size-full appearance-none rounded-md border"
            style={{ background: value }}
          />
        </span>
        <span>
          <input
            autoCapitalize="none"
            autoCorrect="off"
            id={id}
            value={text}
            onChange={onChangeTextValue}
            onFocus={(e) => {
              isEditingRef.current = true;
              e.currentTarget.select();
            }}
            onBlur={(e) => {
              isEditingRef.current = false;
              setText(formatHexString(e.currentTarget.value) ?? value);
            }}
            placeholder="#000000"
            maxLength={8} // #000000 1文字打ってから削除したい時を考慮
            spellCheck={false}
            className="border-primary text-textfield bg-textfield min-h-10 w-full rounded-md border px-4 py-2 font-mono leading-8"
          />
        </span>
      </p>
    </>
  );
};
