import { act, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { useBeforeUnload } from '@/hooks/use-before-unload';

describe('useBeforeUnload', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('changeイベントが発火するまではbeforeunloadを購読しない', () => {
    const addEventListenerSpy = vi.spyOn(window, 'addEventListener');
    const { result } = renderHook(() => useBeforeUnload());
    const container = document.createElement('input');
    document.body.appendChild(container);

    act(() => {
      result.current.ref(container);
    });

    expect(addEventListenerSpy).not.toHaveBeenCalledWith('beforeunload', expect.any(Function));

    addEventListenerSpy.mockRestore();
  });

  it('changeイベント発火後はbeforeunloadでpreventDefaultする', () => {
    const { result } = renderHook(() => useBeforeUnload());
    const container = document.createElement('input');
    document.body.appendChild(container);

    act(() => {
      result.current.ref(container);
    });
    container.dispatchEvent(new Event('change'));

    const event = new Event('beforeunload', { cancelable: true });
    window.dispatchEvent(event);

    expect(event.defaultPrevented).toBe(true);
  });

  it('アンマウント時にリスナーを解除する', () => {
    const { result, unmount } = renderHook(() => useBeforeUnload());
    const container = document.createElement('input');
    document.body.appendChild(container);

    act(() => {
      result.current.ref(container);
    });
    container.dispatchEvent(new Event('change'));
    unmount();

    const event = new Event('beforeunload', { cancelable: true });
    window.dispatchEvent(event);

    expect(event.defaultPrevented).toBe(false);
  });
});
