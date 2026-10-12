import type { InputEvent } from 'react';

/** inputType と結果の value が両方一致した場合のみ、目的の操作が行われたと判定する */
export const isInputTypeWithValue = ({
  inputEvent,
  expectedInputType,
  expectedValue,
}: {
  inputEvent: InputEvent<HTMLInputElement | HTMLTextAreaElement>;
  expectedInputType: string;
  expectedValue: string;
}) => inputEvent.nativeEvent.inputType === expectedInputType && inputEvent.currentTarget.value === expectedValue;

/** 要素の内容が全選択されているかを判定する */
export const isFullySelected = (el: { selectionStart: number | null; selectionEnd: number | null; value: string }) =>
  el.selectionStart === 0 && el.selectionEnd === el.value.length;
