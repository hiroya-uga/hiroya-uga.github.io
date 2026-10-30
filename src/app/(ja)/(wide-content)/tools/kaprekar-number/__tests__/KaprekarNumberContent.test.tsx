import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { KaprekarNumberContent } from '@/app/(ja)/(wide-content)/tools/kaprekar-number/Client';

describe('KaprekarNumberContent', () => {
  beforeEach(() => {
    Element.prototype.scrollIntoView = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const getInput = () => screen.getByPlaceholderText<HTMLInputElement>('168');
  const getCountText = () =>
    screen.getAllByText(/試行回数/).find((element) => element.textContent?.startsWith('試行回数：'))!;
  const getDigitsText = () => screen.getByText(/入力桁数/);

  it('初期表示は試行回数0・入力桁数0', () => {
    render(<KaprekarNumberContent />);

    expect(getCountText().textContent).toBe('試行回数：0回');
    expect(getDigitsText().textContent).toBe('入力桁数：0桁');
  });

  it('入力した桁数が表示される', async () => {
    const user = userEvent.setup();
    render(<KaprekarNumberContent />);

    await user.type(getInput(), '6174');

    expect(getDigitsText().textContent).toBe('入力桁数：4桁');
  });

  it('全角数字は半角に変換して入力される', async () => {
    const user = userEvent.setup();
    render(<KaprekarNumberContent />);

    await user.type(getInput(), '６１７４');

    expect(getInput().value).toBe('6174');
  });

  it('カプレカ数6174は1回目で到達し、試行回数が1になる', async () => {
    const user = userEvent.setup();
    render(<KaprekarNumberContent />);

    await user.type(getInput(), '6174');
    await user.click(screen.getByRole('button', { name: '計算する' }));

    expect(getCountText().textContent).toBe('試行回数：1回');
    expect(screen.getByText('カプレカ数に到達しました！').textContent).toContain('カプレカ数に到達しました');
  });

  it('ゾロ目はエラーになる', async () => {
    const user = userEvent.setup();
    render(<KaprekarNumberContent />);

    await user.type(getInput(), '1111');
    await user.click(screen.getByRole('button', { name: '計算する' }));

    expect(screen.getByText('エラー：ゾロ目以外の数値を入力してください。')).toBeDefined();
  });

  describe('最大試行回数', () => {
    const getMaxTimesInput = () => screen.getByLabelText<HTMLInputElement>('最大試行回数');

    it('入力中は整形されず、計算する押下時に半角へ整形される', async () => {
      const user = userEvent.setup();
      render(<KaprekarNumberContent />);

      await user.clear(getMaxTimesInput());
      await user.type(getMaxTimesInput(), '５０a');

      expect(getMaxTimesInput().value).toBe('５０a');

      await user.type(getInput(), '6174');
      await user.click(screen.getByRole('button', { name: '計算する' }));

      expect(getMaxTimesInput().value).toBe('50');
    });

    it.each(['', '0', 'abc', '-5'])('異常値「%s」は計算する押下時に100へ戻る', async (value) => {
      const user = userEvent.setup();
      render(<KaprekarNumberContent />);

      await user.clear(getMaxTimesInput());

      if (value !== '') {
        await user.type(getMaxTimesInput(), value);
      }

      await user.type(getInput(), '6174');
      await user.click(screen.getByRole('button', { name: '計算する' }));

      expect(getMaxTimesInput().value).toBe('100');
    });
  });
});
