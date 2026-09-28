import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';

import { useKeyboardMasterConfig } from '../hooks/use-keyboard-master-config';
import { QUESTS } from '../quests';

const SAVEDATA_KEY = 'savedata-keyboard-master';

beforeEach(() => {
  localStorage.clear();
});

describe('useKeyboardMasterConfig', () => {
  it('保存データがなければ既定値(絞った10問・tryCount 0)で始まる', async () => {
    const { result } = renderHook(() => useKeyboardMasterConfig());

    await waitFor(() =>
      expect(result.current.config).toStrictEqual({
        flags: { timeLimit: false, animation: true, random: false },
        best: null,
        tryCount: 0,
        questCount: 10,
      }),
    );
  });

  it('updateTryCountはconfigとlocalStorageの両方を更新する', async () => {
    const { result } = renderHook(() => useKeyboardMasterConfig());

    await waitFor(() => expect(result.current.config.tryCount).toBe(0));

    act(() => {
      result.current.updateTryCount(3);
    });

    // localStorageへの書き込みはデバウンスされるため、config反映は同期・保存は非同期で確認する
    expect(result.current.config.tryCount).toBe(3);
    await waitFor(() => expect(localStorage.getItem(SAVEDATA_KEY)).not.toBeNull());
    expect(JSON.parse(localStorage.getItem(SAVEDATA_KEY) ?? '{}').tryCount).toBe(3);
  });

  it('updateQuestCountはconfigとlocalStorageの両方を更新する', async () => {
    const { result } = renderHook(() => useKeyboardMasterConfig());

    await waitFor(() => expect(result.current.config.questCount).toBe(10));

    act(() => {
      result.current.updateQuestCount(20);
    });

    expect(result.current.config.questCount).toBe(20);
    await waitFor(() => expect(JSON.parse(localStorage.getItem(SAVEDATA_KEY) ?? '{}').questCount).toBe(20));
  });

  it('bestがnullのときは保存データにbestを含めない', async () => {
    const { result } = renderHook(() => useKeyboardMasterConfig());

    await waitFor(() => expect(result.current.config.tryCount).toBe(0));

    act(() => {
      result.current.updateTryCount(1);
    });

    expect(JSON.parse(localStorage.getItem(SAVEDATA_KEY) ?? '{}')).not.toHaveProperty('best');
  });

  it('保存済みのquestCountがALLの総数を超えていてもクランプする', async () => {
    localStorage.setItem(SAVEDATA_KEY, JSON.stringify({ questCount: QUESTS.all.length + 100 }));

    const { result } = renderHook(() => useKeyboardMasterConfig());

    await waitFor(() => expect(result.current.config.questCount).toBe(QUESTS.all.length));
  });

  it('保存済みのflagsを読み込んで復元する', async () => {
    localStorage.setItem(SAVEDATA_KEY, JSON.stringify({ flags: { random: true } }));

    const { result } = renderHook(() => useKeyboardMasterConfig());

    await waitFor(() =>
      expect(result.current.config.flags).toStrictEqual({ timeLimit: false, animation: true, random: true }),
    );
  });
});
