import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { useUnicodePlaygroundState } from '../../../client/UnicodePlaygroundContent/hooks';

describe('useUnicodePlaygroundState', () => {
  describe('applyValue', () => {
    it.each([
      {
        title: '通常の文字列',
        initialValue: '',
        nextValue: 'abc',
        expectedStepIndex: 2,
      },
      {
        title: 'サロゲートペアを含む文字列',
        initialValue: '',
        nextValue: '\u{1F468}',
        expectedStepIndex: 0,
      },
      {
        title: '空文字列',
        initialValue: 'abc',
        nextValue: '',
        expectedStepIndex: 0,
      },
    ])(
      '$title では stepIndex を最後のコードポイント位置に設定する',
      ({ initialValue, nextValue, expectedStepIndex }) => {
        const { result } = renderHook(() => useUnicodePlaygroundState(initialValue));
        act(() => result.current.applyValue(nextValue));
        expect(result.current.stepIndex).toBe(expectedStepIndex);
      },
    );

    it.each(['a\nb', 'a\rb'])('%s を入力すると multiline が true になる', (value) => {
      const { result } = renderHook(() => useUnicodePlaygroundState(''));
      act(() => result.current.applyValue(value));
      expect(result.current.multiline).toBe(true);
    });

    it('一度 true になった multiline は applyValue だけでは false に戻らない', () => {
      const { result } = renderHook(() => useUnicodePlaygroundState(''));
      act(() => result.current.applyValue('a\nb'));
      act(() => result.current.applyValue('abc'));
      expect(result.current.multiline).toBe(true);
    });
  });
});
