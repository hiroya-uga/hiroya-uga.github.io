import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const api = vi.hoisted(() => ({ fetchCounts: vi.fn(), increment: vi.fn() }));
const unlock = vi.hoisted(() => vi.fn());

vi.mock('@/api/likes-api', () => ({ likesApi: api }));
vi.mock('@/hooks/use-achievement', () => ({
  useAchievement: () => ({ toastProps: { message: '', setMessage: vi.fn() }, unlock }),
}));
vi.mock('@/components/ui/dialogs/Toast', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/components/ui/dialogs/Toast')>()),
  Toast: ({ message }: { message: string }) => (message ? <p data-testid="toast">{message}</p> : null),
}));

import { LikeButton } from '@/components/ui/buttons/LikeButton';

const TARGET = '/articles/a';

const stored = () => JSON.parse(localStorage.getItem('liked') ?? 'null');

beforeEach(() => {
  localStorage.clear();
  api.fetchCounts.mockReset().mockResolvedValue({ [TARGET]: 5 });
  api.increment.mockReset().mockResolvedValue({ status: 'success', count: 6 });
  unlock.mockReset();
});

describe('LikeButton', () => {
  it('押下済みでもホバーするまで件数を取得しない', async () => {
    localStorage.setItem('liked', JSON.stringify([TARGET]));
    render(<LikeButton target={TARGET} />);
    await screen.findByRole('button', { name: 'いいねする' });

    expect(api.fetchCounts).not.toHaveBeenCalled();
    expect(screen.queryByText('5')).not.toBeInTheDocument();
  });

  it('未押下のユーザーはホバーやフォーカスをしても件数を取得しない', async () => {
    render(<LikeButton target={TARGET} />);
    await userEvent.hover(await screen.findByRole('button', { name: 'いいねする' }));
    await userEvent.tab();

    expect(api.fetchCounts).not.toHaveBeenCalled();
    expect(screen.queryByText('5')).not.toBeInTheDocument();
  });

  it('押下済みのユーザーがホバーすると件数を取得して表示する', async () => {
    localStorage.setItem('liked', JSON.stringify([TARGET]));
    render(<LikeButton target={TARGET} />);
    await userEvent.hover(await screen.findByRole('button', { name: 'いいねする' }));

    expect(await screen.findByText('5')).toBeInTheDocument();
  });

  it('押下済みのユーザーがフォーカスしても件数を取得して表示する', async () => {
    localStorage.setItem('liked', JSON.stringify([TARGET]));
    render(<LikeButton target={TARGET} />);
    await userEvent.tab();

    expect(await screen.findByText('5')).toBeInTheDocument();
  });

  it('ホバーとフォーカスが続いても取得は 1 回にまとめる', async () => {
    localStorage.setItem('liked', JSON.stringify([TARGET]));
    render(<LikeButton target={TARGET} />);
    const button = await screen.findByRole('button', { name: 'いいねする' });

    await userEvent.hover(button);
    await userEvent.tab();
    await screen.findByText('5');

    expect(api.fetchCounts).toHaveBeenCalledTimes(1);
  });

  it('件数が無い記事は 0 を表示する', async () => {
    localStorage.setItem('liked', JSON.stringify([TARGET]));
    api.fetchCounts.mockResolvedValue({});
    render(<LikeButton target={TARGET} />);
    await userEvent.hover(await screen.findByRole('button', { name: 'いいねする' }));

    expect(await screen.findByText('0')).toBeInTheDocument();
  });

  it('件数の取得に失敗しても、ボタンは表示したまま件数を出さず、次のホバーで再取得する', async () => {
    localStorage.setItem('liked', JSON.stringify([TARGET]));
    api.fetchCounts.mockResolvedValueOnce(null);
    render(<LikeButton target={TARGET} />);
    const button = await screen.findByRole('button', { name: 'いいねする' });

    await userEvent.hover(button);
    await waitFor(() => expect(api.fetchCounts).toHaveBeenCalledTimes(1));

    expect(button.parentElement).not.toHaveClass('invisible');
    expect(screen.queryByText('5')).not.toBeInTheDocument();

    await userEvent.unhover(button);
    await userEvent.hover(button);

    expect(await screen.findByText('5')).toBeInTheDocument();
  });

  it('件数の取得を待たずにボタンを表示する', async () => {
    render(<LikeButton target={TARGET} />);

    expect((await screen.findByRole('button', { name: 'いいねする' })).parentElement).not.toHaveClass('invisible');
  });

  it('押すと、サーバーが返した件数を表示して押下済みになり、記録される', async () => {
    render(<LikeButton target={TARGET} />);
    await userEvent.click(await screen.findByRole('button', { name: 'いいねする' }));

    const button = screen.getByRole('button', { name: 'いいねする' });

    expect(await screen.findByText('6')).toBeInTheDocument();
    expect(button).toHaveAttribute('aria-pressed', 'true');
    expect(api.increment).toHaveBeenCalledWith(TARGET);
    await waitFor(() => expect(stored()).toStrictEqual([TARGET]));
    expect(unlock).toHaveBeenCalledWith('thank-you-for-liking');
  });

  it('未押下のユーザーが押しても、件数は取得せずサーバーが返した件数を使う', async () => {
    render(<LikeButton target={TARGET} />);
    await userEvent.click(await screen.findByRole('button', { name: 'いいねする' }));

    expect(await screen.findByText('6')).toBeInTheDocument();
    expect(api.fetchCounts).not.toHaveBeenCalled();
  });

  it('押した直後にホバーしても、キャッシュされた件数で上書きしない', async () => {
    render(<LikeButton target={TARGET} />);
    const button = await screen.findByRole('button', { name: 'いいねする' });

    await userEvent.click(button);
    expect(await screen.findByText('6')).toBeInTheDocument();
    await userEvent.hover(button);

    expect(api.fetchCounts).not.toHaveBeenCalled();
    expect(screen.getByText('6')).toBeInTheDocument();
  });

  it('重複と判定された場合は、サーバーが返した件数を表示して押下済みとして記録する', async () => {
    api.increment.mockResolvedValue({ status: 'duplicate', count: 5 });
    render(<LikeButton target={TARGET} />);
    await userEvent.click(await screen.findByRole('button', { name: 'いいねする' }));

    const button = screen.getByRole('button', { name: 'いいねする' });

    expect(await screen.findByText('5')).toBeInTheDocument();
    expect(button).toHaveAttribute('aria-pressed', 'true');
    await waitFor(() => expect(stored()).toStrictEqual([TARGET]));
    expect(screen.queryByTestId('toast')).not.toBeInTheDocument();
  });

  it('記録済みの記事は押下済みで表示され、再度押しても送信しない', async () => {
    localStorage.setItem('liked', JSON.stringify([TARGET]));
    render(<LikeButton target={TARGET} />);
    const button = await screen.findByRole('button', { name: 'いいねする' });

    expect(button).toHaveAttribute('aria-pressed', 'true');
    await userEvent.click(button);

    expect(api.increment).not.toHaveBeenCalled();
  });

  it.each([
    ['error', 'いいねに失敗しました'],
    ['limit', 'いいねの回数が上限に達しました。時間をおいてお試しください'],
  ] as const)('%s の場合は通知し、押下済みにも記録にもしない', async (status, message) => {
    api.increment.mockResolvedValue({ status, count: null });
    render(<LikeButton target={TARGET} />);
    await userEvent.click(await screen.findByRole('button', { name: 'いいねする' }));

    expect(await screen.findByTestId('toast')).toHaveTextContent(message);
    expect(screen.getByRole('button', { name: 'いいねする' })).toHaveAttribute('aria-pressed', 'false');
    expect(stored()).toBeNull();
  });

  it('通信中は押下済みとして扱い、二重送信しない', async () => {
    let resolve: (value: { status: 'success'; count: number }) => void = () => {};
    api.increment.mockReturnValue(new Promise((r) => (resolve = r)));
    render(<LikeButton target={TARGET} />);
    const button = await screen.findByRole('button', { name: 'いいねする' });

    await userEvent.click(button);
    await userEvent.click(button);

    expect(api.increment).toHaveBeenCalledTimes(1);
    expect(button).toHaveAttribute('aria-pressed', 'true');
    await act(async () => resolve({ status: 'success', count: 6 }));
  });
});
