import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

import { TRANSITION_DURATION } from '@/constants/css';
import { DIALOG_PORTAL_ID } from '@/constants/id';
import { Confirm, type ConfirmData } from '../Confirm';

// jsdomは<dialog>のshowModal/closeを実装していないため、open属性の付け外しだけを行う簡易実装に差し替える
beforeAll(() => {
  HTMLDialogElement.prototype.showModal = function (this: HTMLDialogElement) {
    this.setAttribute('open', '');
  };
  HTMLDialogElement.prototype.close = function (this: HTMLDialogElement) {
    this.removeAttribute('open');
  };
});

afterAll(() => {
  // @ts-expect-error テスト用に追加したpolyfillを除去する
  delete HTMLDialogElement.prototype.showModal;
  // @ts-expect-error テスト用に追加したpolyfillを除去する
  delete HTMLDialogElement.prototype.close;
});

let portalContainer: HTMLDivElement;

beforeEach(() => {
  portalContainer = document.createElement('div');
  portalContainer.id = DIALOG_PORTAL_ID;
  document.body.appendChild(portalContainer);
  vi.useFakeTimers({ shouldAdvanceTime: true });
});

afterEach(() => {
  portalContainer.remove();
  vi.useRealTimers();
});

const createConfirmData = (overrides: Partial<ConfirmData> = {}): ConfirmData => ({
  message: '確認してください',
  yes: vi.fn(),
  ...overrides,
});

const Harness = ({ initial }: { initial: ConfirmData | null }) => {
  const [confirm, setConfirmData] = useState<ConfirmData | null>(initial);

  return (
    <>
      <Confirm confirm={confirm} setConfirmData={setConfirmData} />
      <button type="button" onClick={() => setConfirmData(null)}>
        外部から閉じる
      </button>
    </>
  );
};

describe('Confirm', () => {
  it('confirmがnullのときは何も表示しない', () => {
    render(<Harness initial={null} />);

    expect(screen.queryByRole('alertdialog')).toBeNull();
  });

  it('DIALOG_PORTAL_IDの要素が存在しないときは何も表示しない', () => {
    portalContainer.remove();

    render(<Harness initial={createConfirmData()} />);

    expect(screen.queryByRole('alertdialog')).toBeNull();
  });

  it('confirmがセットされるとメッセージとはい/いいえボタンを表示する', () => {
    render(<Harness initial={createConfirmData({ no: vi.fn() })} />);

    const dialog = screen.getByRole('alertdialog');
    expect(dialog).toHaveAttribute('open');
    expect(screen.getByText('確認してください')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'はい' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'いいえ' })).toBeInTheDocument();
  });

  it('noを渡さないといいえボタンは表示されない', () => {
    render(<Harness initial={createConfirmData()} />);

    expect(screen.queryByRole('button', { name: 'いいえ' })).toBeNull();
  });

  it('yesLabel/noLabelを指定するとそのラベルでボタンを表示する', () => {
    render(<Harness initial={createConfirmData({ yesLabel: '削除する', noLabel: 'キャンセル', no: vi.fn() })} />);

    expect(screen.getByRole('button', { name: '削除する' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'キャンセル' })).toBeInTheDocument();
  });

  it('childrenを渡すと本文と一緒に表示する', () => {
    render(<Harness initial={createConfirmData({ children: <p>補足説明</p> })} />);

    expect(screen.getByText('補足説明')).toBeInTheDocument();
  });

  it('はいボタンをクリックするとyesコールバックを呼びダイアログを閉じる', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    const yes = vi.fn();
    render(<Harness initial={createConfirmData({ yes })} />);

    await user.click(screen.getByRole('button', { name: 'はい' }));

    expect(yes).toHaveBeenCalledOnce();
    expect(screen.getByRole('alertdialog', { hidden: true })).not.toHaveAttribute('open');
  });

  it('いいえボタンをクリックするとnoコールバックを呼びダイアログを閉じる', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    const no = vi.fn();
    render(<Harness initial={createConfirmData({ no })} />);

    await user.click(screen.getByRole('button', { name: 'いいえ' }));

    expect(no).toHaveBeenCalledOnce();
    expect(screen.getByRole('alertdialog', { hidden: true })).not.toHaveAttribute('open');
  });

  it('外部からsetConfirmData(null)されても、閉じるトランジションが終わるまで直前の内容を表示し続ける', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<Harness initial={createConfirmData({ message: '本当に削除しますか？' })} />);

    await user.click(screen.getByRole('button', { name: '外部から閉じる' }));

    const dialog = screen.getByRole('alertdialog', { hidden: true });
    expect(dialog).not.toHaveAttribute('open');
    expect(screen.getByText('本当に削除しますか？')).toBeInTheDocument();
  });

  it('閉じるトランジション完了後も、新しいconfirmが来るまでは前回の内容が残り続ける', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<Harness initial={createConfirmData({ message: '本当に削除しますか？' })} />);

    await user.click(screen.getByRole('button', { name: '外部から閉じる' }));
    await act(async () => {
      await vi.advanceTimersByTimeAsync(TRANSITION_DURATION);
    });

    expect(screen.getByText('本当に削除しますか？')).toBeInTheDocument();
  });
});
