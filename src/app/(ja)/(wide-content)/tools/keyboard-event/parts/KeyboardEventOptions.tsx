import { Checkbox, TextField } from '@/components/Form';
import { Ref, RefObject } from 'react';
import { KEYBOARD_EVENT_DEFAULT_OPTIONS } from '../constants';

export const KeyboardEventOptions = (
  {
    checkboxStatusRef,
    isScrollIgnoredRef,
  }: {
    checkboxStatusRef: RefObject<Record<string, boolean>>;
    isScrollIgnoredRef: RefObject<boolean>;
  },
  ref: Ref<HTMLTextAreaElement>,
) => {
  return (
    <div className="mb-6 flex flex-wrap gap-3 sm:gap-10">
      <div className="grow">
        <TextField label="テスト用テキストフィールド" multiline noResize ref={ref} />
      </div>
      <div>
        <fieldset>
          <legend className="mb-2 block w-fit text-sm font-bold leading-snug">Options</legend>
          <ul className="space-y-2.5">
            {Object.entries(KEYBOARD_EVENT_DEFAULT_OPTIONS).map(([key, value]) => (
              <li key={key} translate="no">
                <Checkbox
                  label={key === 'onkeypress' ? 'onkeypress (legacy)' : key}
                  defaultChecked={value}
                  onChange={(e) => {
                    const isChecked = e.currentTarget.checked;

                    checkboxStatusRef.current = {
                      ...checkboxStatusRef.current,
                      [key]: isChecked,
                    };
                  }}
                />
              </li>
            ))}
            <li>
              <Checkbox
                label="scroll系のキーの動作を無視する"
                defaultChecked={false}
                onChange={(e) => {
                  isScrollIgnoredRef.current = e.currentTarget.checked;
                }}
              />
            </li>
          </ul>
        </fieldset>
      </div>
    </div>
  );
};
