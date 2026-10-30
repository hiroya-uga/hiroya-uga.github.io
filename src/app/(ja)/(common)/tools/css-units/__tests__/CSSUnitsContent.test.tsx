import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { CSSUnitsContent } from '@/app/(ja)/(common)/tools/css-units/Client';

describe('CSSUnitsContent', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'ResizeObserver',
      class {
        observe() {}
        unobserve() {}
        disconnect() {}
      },
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  const getNumberInput = () => screen.getByRole<HTMLInputElement>('spinbutton');
  const getRangeInput = () => screen.getByRole<HTMLInputElement>('slider');

  it('初期値は100で、数値入力とスライダーが同じ値を示す', () => {
    render(<CSSUnitsContent id="test" />);

    expect(getNumberInput().value).toBe('100');
    expect(getRangeInput().value).toBe('100');
  });

  it('先頭の0は取り除かれる', async () => {
    const user = userEvent.setup();
    render(<CSSUnitsContent id="test" />);

    await user.clear(getNumberInput());
    await user.type(getNumberInput(), '05');

    expect(getNumberInput().value).toBe('5');
  });

  it('200を超える値は200に丸められる', async () => {
    const user = userEvent.setup();
    render(<CSSUnitsContent id="test" />);

    await user.clear(getNumberInput());
    await user.type(getNumberInput(), '999');

    expect(getNumberInput().value).toBe('200');
    expect(getRangeInput().value).toBe('200');
  });

  it('負の値は0に丸められる', () => {
    render(<CSSUnitsContent id="test" />);

    fireEvent.change(getNumberInput(), { target: { value: '-5' } });

    expect(getNumberInput().value).toBe('0');
  });
});
