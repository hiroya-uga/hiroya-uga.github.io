import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { SortVisualizerContent } from '@/app/(ja)/(wide-content)/tools/sort-visualizer/Client';

describe('SortVisualizerContent', () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  const setup = async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<SortVisualizerContent />);

    return user;
  };

  it('ソートを1つも選んでいないと実行ボタンは押せない', async () => {
    const user = await setup();

    await user.click(screen.getByRole('checkbox', { name: 'バブルソート' }));

    expect(screen.getByRole('button', { name: '実行する' }).getAttribute('aria-disabled')).toBe('true');
  });

  it('実行中はボタンが「処理を強制終了する」になる', async () => {
    const user = await setup();

    await user.click(screen.getByRole('button', { name: '実行する' }));

    expect(screen.getByRole('button', { name: '処理を強制終了する' })).toBeDefined();
  });

  it('強制終了を押すと「処理中...」を経て「実行する」に戻る', async () => {
    const user = await setup();

    await user.click(screen.getByRole('button', { name: '実行する' }));
    await user.click(screen.getByRole('button', { name: '処理を強制終了する' }));

    expect(screen.getByRole('button', { name: '処理中...' })).toBeDefined();

    await act(async () => {
      await vi.advanceTimersByTimeAsync(1000);
    });

    expect(screen.getByRole('button', { name: '実行する' })).toBeDefined();
  });

  it('終了後にもう一度実行すると「処理中...」ではなく「処理を強制終了する」になる', async () => {
    const user = await setup();

    await user.click(screen.getByRole('button', { name: '実行する' }));
    await user.click(screen.getByRole('button', { name: '処理を強制終了する' }));
    await act(async () => {
      await vi.advanceTimersByTimeAsync(1000);
    });
    await user.click(screen.getByRole('button', { name: '実行する' }));

    expect(screen.getByRole('button', { name: '処理を強制終了する' })).toBeDefined();
  });
});
