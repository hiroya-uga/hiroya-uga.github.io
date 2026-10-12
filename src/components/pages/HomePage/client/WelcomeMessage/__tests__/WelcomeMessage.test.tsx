import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { WelcomeMessage } from '../WelcomeMessage';

const counter = vi.hoisted(() => ({ fetchCount: vi.fn() }));

vi.mock('@/api', () => ({ counterApi: counter }));

beforeEach(() => {
  counter.fetchCount.mockReset();
  sessionStorage.clear();
});

describe('WelcomeMessage', () => {
  it('件数を取得できたときは、取得した値で「訪問者です」と読み上げる', async () => {
    counter.fetchCount.mockResolvedValue(50930);
    render(<WelcomeMessage />);

    expect(await screen.findByText('あなたは050930番目の訪問者です。')).toBeTruthy();
  });

  it('件数を取得できなかったときは、「訪問者かもしれません」と読み上げる', async () => {
    counter.fetchCount.mockResolvedValue(null);
    render(<WelcomeMessage />);

    expect(await screen.findByText(/^あなたは\d+番目の訪問者かもしれません。$/)).toBeTruthy();
  });
});
