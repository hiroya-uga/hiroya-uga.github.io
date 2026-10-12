import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useQuestTimer } from '../hooks/use-quest-timer';
import type { NodeQuest } from '../quests';

const createQuest = (timeLimit?: number): NodeQuest => ({
  type: 'node',
  title: 'title',
  hint: 'hint',
  explanation: 'explanation',
  timeLimit,
  Node: () => null,
});

describe('useQuestTimer', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('timeLimitがない場合はnullを返す', () => {
    const { result } = renderHook(() => useQuestTimer({ isEnabled: true, quest: createQuest(), onTimeout: vi.fn() }));

    expect(result.current).toBeNull();
  });

  it('isEnabledがfalseの場合はnullを返す', () => {
    const { result } = renderHook(() =>
      useQuestTimer({ isEnabled: false, quest: createQuest(5000), onTimeout: vi.fn() }),
    );

    expect(result.current).toBeNull();
  });

  it('経過時間に応じて残り時間を1秒ごとに減らす', () => {
    // quest/onTimeoutをrenderHookのコールバック内で生成すると毎レンダーで参照が変わり、
    // useEffectの依存配列変化で締切がリセットされ続けてしまうため、外側で1つに固定する
    const quest = createQuest(5000);
    const onTimeout = vi.fn();
    const { result } = renderHook(() => useQuestTimer({ isEnabled: true, quest, onTimeout }));

    expect(result.current).toBe(5000);

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(result.current).toBe(4000);
  });

  it('残り時間が0になるとonTimeoutを1回だけ呼ぶ', () => {
    const quest = createQuest(2000);
    const onTimeout = vi.fn();
    const { result } = renderHook(() => useQuestTimer({ isEnabled: true, quest, onTimeout }));

    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(result.current).toBe(0);
    expect(onTimeout).toHaveBeenCalledTimes(1);

    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(onTimeout).toHaveBeenCalledTimes(1);
  });

  it('アンマウント時にタイマーをクリアする', () => {
    const quest = createQuest(2000);
    const onTimeout = vi.fn();
    const { unmount } = renderHook(() => useQuestTimer({ isEnabled: true, quest, onTimeout }));

    unmount();

    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(onTimeout).not.toHaveBeenCalled();
  });
});
