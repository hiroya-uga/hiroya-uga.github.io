import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useCopyButton } from '@/hooks/use-copy-button';

const createButtonLabel = () => {
  const buttonLabel = document.createElement('span');
  buttonLabel.textContent = 'Copy';
  return buttonLabel;
};

describe('useCopyButton', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it('writeTextに成功するとラベルをCopied!にし、2秒後にCopyへ戻す', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal('navigator', { clipboard: { writeText } });

    const { result } = renderHook(() => useCopyButton());
    const buttonLabel = createButtonLabel();

    await act(async () => {
      await result.current.handleClickCopyButton('hello', buttonLabel);
    });

    expect(writeText).toHaveBeenCalledWith('hello');
    expect(buttonLabel.textContent).toBe('Copied!');

    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(buttonLabel.textContent).toBe('Copy');
  });

  it('writeTextに失敗するとラベルをError!にする', async () => {
    const writeText = vi.fn().mockRejectedValue(new Error('denied'));
    vi.stubGlobal('navigator', { clipboard: { writeText } });

    const { result } = renderHook(() => useCopyButton());
    const buttonLabel = createButtonLabel();

    await act(async () => {
      await result.current.handleClickCopyButton('hello', buttonLabel);
    });

    expect(buttonLabel.textContent).toBe('Error!');
  });

  it('既にCopied!表示中はwriteを呼び直さない', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal('navigator', { clipboard: { writeText } });

    const { result } = renderHook(() => useCopyButton());
    const buttonLabel = createButtonLabel();
    buttonLabel.textContent = 'Copied!';

    await act(async () => {
      await result.current.handleClickCopyButton('hello', buttonLabel);
    });

    expect(writeText).not.toHaveBeenCalled();
  });

  it('mimeTypeがtext/htmlの場合はClipboardItemで書き込む', async () => {
    const write = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal('navigator', { clipboard: { write } });
    vi.stubGlobal(
      'ClipboardItem',
      vi.fn(function ClipboardItem(this: unknown, items: unknown) {
        return items;
      }),
    );

    const { result } = renderHook(() => useCopyButton({ mimeType: 'text/html' }));
    const buttonLabel = createButtonLabel();

    await act(async () => {
      await result.current.handleClickCopyButton({ text: 'plain', html: '<b>rich</b>' }, buttonLabel);
    });

    expect(write).toHaveBeenCalled();
    expect(buttonLabel.textContent).toBe('Copied!');
  });

  it('アンマウント時に保留中のタイマーをクリアする', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal('navigator', { clipboard: { writeText } });
    const clearTimeoutSpy = vi.spyOn(globalThis, 'clearTimeout');

    const { result, unmount } = renderHook(() => useCopyButton());
    const buttonLabel = createButtonLabel();

    await act(async () => {
      await result.current.handleClickCopyButton('hello', buttonLabel);
    });

    unmount();

    expect(clearTimeoutSpy).toHaveBeenCalled();

    clearTimeoutSpy.mockRestore();
  });
});
