import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

import { DIALOG_PORTAL_ID } from '@/constants/id';
import type { KeyboardMasterConfig } from '../hooks';
import { IdleScreen } from '../parts';
import { QUESTS } from '../quests';

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
});

afterEach(() => {
  portalContainer.remove();
});

const createConfig = (
  patch: Partial<KeyboardMasterConfig['flags']> = {},
  overrides: Partial<Pick<KeyboardMasterConfig, 'tryCount'>> = {},
): KeyboardMasterConfig => ({
  flags: { timeLimit: false, animation: true, random: false, ...patch },
  best: null,
  tryCount: 2,
  questCount: 10,
  ...overrides,
});

const openConfig = async (user: ReturnType<typeof userEvent.setup>) => {
  await user.click(screen.getByRole('button', { name: 'CONFIG' }));
};

describe('IdleScreen の問題数表示', () => {
  it('2回クリアするまでは案内文のみで、入力欄は出ない', async () => {
    const user = userEvent.setup();
    render(
      <IdleScreen
        config={createConfig({}, { tryCount: 1 })}
        shouldFocusStart={false}
        retryCount={null}
        onChangeFlags={vi.fn()}
        onChangeQuestCount={vi.fn()}
        onClearRetry={vi.fn()}
        onStart={vi.fn()}
      />,
    );

    await openConfig(user);

    expect(screen.getByText('ランダム出題は3回目以降解放されます。')).toBeInTheDocument();
    expect(screen.queryByRole('spinbutton', { name: '問題数' })).not.toBeInTheDocument();
  });

  it('2回クリア後はflags.randomの値に関わらず現在値を持つ数値入力欄が出る', async () => {
    const user = userEvent.setup();
    render(
      <IdleScreen
        config={createConfig({ random: false }, { tryCount: 2 })}
        shouldFocusStart={false}
        retryCount={null}
        onChangeFlags={vi.fn()}
        onChangeQuestCount={vi.fn()}
        onClearRetry={vi.fn()}
        onStart={vi.fn()}
      />,
    );

    await openConfig(user);

    expect(screen.getByRole('spinbutton', { name: '問題数' })).toHaveValue(10);
  });

  it('ALLの総数を超える値を入力すると、ALLの総数にクランプする', async () => {
    const user = userEvent.setup();
    const onChangeQuestCount = vi.fn();
    render(
      <IdleScreen
        config={createConfig({ random: true })}
        shouldFocusStart={false}
        retryCount={null}
        onChangeFlags={vi.fn()}
        onChangeQuestCount={onChangeQuestCount}
        onClearRetry={vi.fn()}
        onStart={vi.fn()}
      />,
    );

    await openConfig(user);

    const input = screen.getByRole('spinbutton', { name: '問題数' });
    fireEvent.input(input, { target: { value: String(QUESTS.all.length + 100) } });

    expect(onChangeQuestCount).toHaveBeenLastCalledWith(QUESTS.all.length);
  });

  it('1未満の値を入力すると、1にクランプする', async () => {
    const user = userEvent.setup();
    const onChangeQuestCount = vi.fn();
    render(
      <IdleScreen
        config={createConfig({ random: true })}
        shouldFocusStart={false}
        retryCount={null}
        onChangeFlags={vi.fn()}
        onChangeQuestCount={onChangeQuestCount}
        onClearRetry={vi.fn()}
        onStart={vi.fn()}
      />,
    );

    await openConfig(user);

    const input = screen.getByRole('spinbutton', { name: '問題数' });
    fireEvent.input(input, { target: { value: '0' } });

    expect(onChangeQuestCount).toHaveBeenLastCalledWith(1);
  });

  it('空欄にしても、入力し直せるようconfigを書き換えない', async () => {
    const user = userEvent.setup();
    const onChangeQuestCount = vi.fn();
    render(
      <IdleScreen
        config={createConfig({ random: true })}
        shouldFocusStart={false}
        retryCount={null}
        onChangeFlags={vi.fn()}
        onChangeQuestCount={onChangeQuestCount}
        onClearRetry={vi.fn()}
        onStart={vi.fn()}
      />,
    );

    await openConfig(user);

    const input = screen.getByRole('spinbutton', { name: '問題数' });
    fireEvent.input(input, { target: { value: '' } });

    expect(onChangeQuestCount).not.toHaveBeenCalled();
  });
});

describe('IdleScreen のランダム出題スイッチ', () => {
  it('2回クリアするまでは無効化される', async () => {
    const user = userEvent.setup();
    render(
      <IdleScreen
        config={createConfig({}, { tryCount: 1 })}
        shouldFocusStart={false}
        retryCount={null}
        onChangeFlags={vi.fn()}
        onChangeQuestCount={vi.fn()}
        onClearRetry={vi.fn()}
        onStart={vi.fn()}
      />,
    );

    await openConfig(user);

    expect(screen.getByRole('switch', { name: 'ランダム出題' })).toBeDisabled();
  });

  it('2回クリア後は有効化される', async () => {
    const user = userEvent.setup();
    render(
      <IdleScreen
        config={createConfig({}, { tryCount: 2 })}
        shouldFocusStart={false}
        retryCount={null}
        onChangeFlags={vi.fn()}
        onChangeQuestCount={vi.fn()}
        onClearRetry={vi.fn()}
        onStart={vi.fn()}
      />,
    );

    await openConfig(user);

    expect(screen.getByRole('switch', { name: 'ランダム出題' })).not.toBeDisabled();
  });
});
