import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { ConfirmData } from '@/components/ui/dialogs/Confirm';
import { getLocalStorage, setLocalStorage } from '@/utils/local-storage';
import { addHistoryToStorage, getUsageCount, isToolPagePathname, ToolHistoryRecorder } from '../ToolHistoryRecorder';

let mockPathname = '/tools/css-units';

vi.mock('next/navigation', () => ({
  usePathname: () => mockPathname,
}));

// 確認ダイアログ本体(dialog要素やMutationObserverを使う)はToolHistoryRecorderの責務外なので、
// 渡されたConfirmDataの中身とyes/noの呼び出しだけを検証できる簡易実装に差し替える
vi.mock('@/components/ui/dialogs/Confirm', () => ({
  Confirm: ({ confirm }: { confirm: ConfirmData | null }) => {
    if (confirm === null) {
      return null;
    }

    return (
      <div role="alertdialog">
        <p>{confirm.message}</p>
        <button type="button" onClick={confirm.yes}>
          {confirm.yesLabel}
        </button>
        {confirm.no !== undefined && (
          <button type="button" onClick={confirm.no}>
            {confirm.noLabel}
          </button>
        )}
      </div>
    );
  },
}));

beforeEach(() => {
  localStorage.clear();
  mockPathname = '/tools/css-units';
  vi.useFakeTimers({ shouldAdvanceTime: true });
});

describe('isToolPagePathname', () => {
  it('/tools/配下のpathnameはtrueを返す', () => {
    expect(isToolPagePathname('/tools/css-units')).toBe(true);
  });

  it('/tools/自体はfalseを返す', () => {
    expect(isToolPagePathname('/tools/')).toBe(false);
  });

  it('/tools/配下でないpathnameはfalseを返す', () => {
    expect(isToolPagePathname('/games/sudoku')).toBe(false);
  });
});

describe('addHistoryToStorage', () => {
  it('末尾スラッシュを除去して履歴に保存する', () => {
    addHistoryToStorage('/tools/css-units/');

    const history = getLocalStorage('recent-tools');
    expect(history?.map((entry) => entry.pathname)).toStrictEqual(['/tools/css-units']);
    expect(history?.[0]?.count).toBe(1);
    expect(typeof history?.[0]?.lastAccessedAt).toBe('string');
  });

  it('既存の履歴の先頭に新しいpathnameを積む', () => {
    addHistoryToStorage('/tools/css-units');
    addHistoryToStorage('/tools/sort-visualizer');

    expect(getLocalStorage('recent-tools')?.map((entry) => entry.pathname)).toStrictEqual([
      '/tools/sort-visualizer',
      '/tools/css-units',
    ]);
  });

  it('既に履歴にあるpathnameは重複させず先頭に移動し、アクセス回数を積算する', () => {
    addHistoryToStorage('/tools/css-units');
    addHistoryToStorage('/tools/sort-visualizer');
    addHistoryToStorage('/tools/css-units');

    const history = getLocalStorage('recent-tools');
    expect(history?.map((entry) => entry.pathname)).toStrictEqual(['/tools/css-units', '/tools/sort-visualizer']);
    expect(history?.[0]?.count).toBe(2);
    expect(history?.[1]?.count).toBe(1);
  });

  it('履歴は最大6件までで、古いものから溢れる', () => {
    for (let i = 0; i < 7; i++) {
      addHistoryToStorage(`/tools/item-${i}`);
    }

    expect(getLocalStorage('recent-tools')?.map((entry) => entry.pathname)).toStrictEqual([
      '/tools/item-6',
      '/tools/item-5',
      '/tools/item-4',
      '/tools/item-3',
      '/tools/item-2',
      '/tools/item-1',
    ]);
  });
});

describe('getUsageCount', () => {
  it('履歴がnullのとき0を返す', () => {
    expect(getUsageCount(null)).toBe(0);
  });

  it('履歴内の各エントリのcountを合算する', () => {
    addHistoryToStorage('/tools/css-units');
    addHistoryToStorage('/tools/sort-visualizer');
    const latestHistory = addHistoryToStorage('/tools/css-units');

    expect(getUsageCount(latestHistory)).toBe(3);
  });
});

describe('ToolHistoryRecorder', () => {
  it('ツールページ以外を訪問しても履歴を記録しない', () => {
    mockPathname = '/games/sudoku';

    render(<ToolHistoryRecorder />);

    expect(getLocalStorage('recent-tools')).toBeNull();
  });

  it('ツールページを訪問すると履歴に記録する', () => {
    render(<ToolHistoryRecorder />);

    expect(getLocalStorage('recent-tools')?.map((entry) => entry.pathname)).toStrictEqual(['/tools/css-units']);
  });

  it('利用回数が閾値未満のときは確認ダイアログを表示しない', async () => {
    render(<ToolHistoryRecorder />);

    await act(async () => {
      await vi.advanceTimersByTimeAsync(300);
    });

    expect(screen.queryByRole('alertdialog')).toBeNull();
  });

  it('利用回数が閾値に達すると確認ダイアログを表示する', async () => {
    addHistoryToStorage('/tools/css-units');
    addHistoryToStorage('/tools/css-units');

    render(<ToolHistoryRecorder />);

    await act(async () => {
      await vi.advanceTimersByTimeAsync(300);
    });

    expect(screen.getByRole('alertdialog')).toBeInTheDocument();
    expect(screen.getByText('ツールの閲覧履歴をトップページに表示しますか？')).toBeInTheDocument();
  });

  it('「利用する」を選ぶとhomeとshownに記録する', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    addHistoryToStorage('/tools/css-units');
    addHistoryToStorage('/tools/css-units');

    render(<ToolHistoryRecorder />);
    await act(async () => {
      await vi.advanceTimersByTimeAsync(300);
    });

    await user.click(screen.getByRole('button', { name: '利用する' }));

    await waitFor(() => {
      expect(getLocalStorage('home')?.['recent-tools-section-is-enabled']).toBe(true);
    });
    expect(getLocalStorage('shown')?.['recent-tools-section-prompt']).toBe(true);
  });

  it('既に履歴機能が有効なときは確認ダイアログを表示しない', async () => {
    addHistoryToStorage('/tools/css-units');
    addHistoryToStorage('/tools/css-units');
    setLocalStorage('home', { 'recent-tools-section-is-enabled': true });

    render(<ToolHistoryRecorder />);

    await act(async () => {
      await vi.advanceTimersByTimeAsync(300);
    });

    expect(screen.queryByRole('alertdialog')).toBeNull();
  });

  it('既にダイアログを表示済みのときは確認ダイアログを表示しない', async () => {
    addHistoryToStorage('/tools/css-units');
    addHistoryToStorage('/tools/css-units');
    setLocalStorage('shown', { 'recent-tools-section-prompt': true });

    render(<ToolHistoryRecorder />);

    await act(async () => {
      await vi.advanceTimersByTimeAsync(300);
    });

    expect(screen.queryByRole('alertdialog')).toBeNull();
  });

  it('「利用しない」を選ぶとhomeを無効のまま記録する', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    addHistoryToStorage('/tools/css-units');
    addHistoryToStorage('/tools/css-units');

    render(<ToolHistoryRecorder />);
    await act(async () => {
      await vi.advanceTimersByTimeAsync(300);
    });

    await user.click(screen.getByRole('button', { name: '利用しない' }));

    await waitFor(() => {
      expect(getLocalStorage('home')?.['recent-tools-section-is-enabled']).toBe(false);
    });
    expect(getLocalStorage('shown')?.['recent-tools-section-prompt']).toBe(true);
  });
});
