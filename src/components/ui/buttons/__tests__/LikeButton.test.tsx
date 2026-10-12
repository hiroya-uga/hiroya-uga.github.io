import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const api = vi.hoisted(() => ({ fetchCounts: vi.fn(), increment: vi.fn() }));

vi.mock('@/api/likes-api', () => ({ likesApi: api }));
vi.mock('@/components/ui/dialogs/Toast', () => ({
  Toast: ({ message }: { message: string }) => <p data-testid="toast">{message}</p>,
}));

import { LikeButton } from '@/components/ui/buttons/LikeButton';

const TARGET = '/articles/a';

const stored = () => JSON.parse(localStorage.getItem('liked') ?? 'null');

beforeEach(() => {
  localStorage.clear();
  api.fetchCounts.mockReset().mockResolvedValue({ [TARGET]: 5 });
  api.increment.mockReset().mockResolvedValue('success');
});

describe('LikeButton', () => {
  it('取得した件数を表示する', async () => {
    render(<LikeButton name={TARGET} />);

    expect(await screen.findByRole('button', { name: 'いいねする（5件のいいね）' })).toHaveAttribute(
      'aria-pressed',
      'false',
    );
  });

  it('件数が無い記事は 0 を表示する', async () => {
    api.fetchCounts.mockResolvedValue({});
    render(<LikeButton name={TARGET} />);

    expect(await screen.findByRole('button', { name: 'いいねする（0件のいいね）' })).toBeInTheDocument();
  });

  it('件数の取得に失敗したら、ボタンを非表示にする', async () => {
    api.fetchCounts.mockResolvedValue(null);
    render(<LikeButton name={TARGET} />);

    // jsdom は CSS を解釈しないため、非表示は invisible クラスの有無で確かめる
    await waitFor(() => expect(api.fetchCounts).toHaveBeenCalled());
    expect(screen.getByRole('button', { hidden: true })).toHaveClass('invisible');
  });

  it('件数の取得が済むと、ボタンを表示する', async () => {
    render(<LikeButton name={TARGET} />);

    expect(await screen.findByRole('button', { name: 'いいねする（5件のいいね）' })).not.toHaveClass('invisible');
  });

  it('押すと件数が増え、押下済みになり、記録される', async () => {
    render(<LikeButton name={TARGET} />);
    await userEvent.click(await screen.findByRole('button', { name: 'いいねする（5件のいいね）' }));

    expect(await screen.findByRole('button', { name: 'いいねする（6件のいいね）' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    expect(api.increment).toHaveBeenCalledWith(TARGET);
    await waitFor(() => expect(stored()).toStrictEqual([TARGET]));
  });

  it('重複と判定された場合は件数を増やさず、押下済みとして記録する', async () => {
    api.increment.mockResolvedValue('duplicate');
    render(<LikeButton name={TARGET} />);
    await userEvent.click(await screen.findByRole('button', { name: 'いいねする（5件のいいね）' }));

    expect(await screen.findByRole('button', { name: 'いいねする（5件のいいね）' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    await waitFor(() => expect(stored()).toStrictEqual([TARGET]));
    expect(screen.getByTestId('toast')).toBeEmptyDOMElement();
  });

  it('記録済みの記事は押下済みで表示され、再度押しても送信しない', async () => {
    localStorage.setItem('liked', JSON.stringify([TARGET]));
    render(<LikeButton name={TARGET} />);
    const button = await screen.findByRole('button', { name: 'いいねする（5件のいいね）' });

    expect(button).toHaveAttribute('aria-pressed', 'true');
    await userEvent.click(button);

    expect(api.increment).not.toHaveBeenCalled();
  });

  it.each([
    ['error', 'いいねに失敗しました'],
    ['limit', 'いいねの回数が上限に達しました。時間をおいてお試しください'],
  ] as const)('%s の場合は通知し、押下済みにも記録にもしない', async (result, message) => {
    api.increment.mockResolvedValue(result);
    render(<LikeButton name={TARGET} />);
    await userEvent.click(await screen.findByRole('button', { name: 'いいねする（5件のいいね）' }));

    expect(await screen.findByTestId('toast')).toHaveTextContent(message);
    expect(screen.getByRole('button', { name: 'いいねする（5件のいいね）' })).toHaveAttribute('aria-pressed', 'false');
    expect(stored()).toBeNull();
  });

  it('通信中は押下済みとして扱い、二重送信しない', async () => {
    let resolve: (value: 'success') => void = () => {};
    api.increment.mockReturnValue(new Promise((r) => (resolve = r)));
    render(<LikeButton name={TARGET} />);
    const button = await screen.findByRole('button', { name: 'いいねする（5件のいいね）' });

    await userEvent.click(button);
    await userEvent.click(button);

    expect(api.increment).toHaveBeenCalledTimes(1);
    expect(button).toHaveAttribute('aria-pressed', 'true');
    await act(async () => resolve('success'));
  });
});
