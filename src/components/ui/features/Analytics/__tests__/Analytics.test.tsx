import { render } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const ga = vi.hoisted(() => ({
  isInitialized: false,
  initialize: vi.fn(),
  send: vi.fn(),
}));
const navigation = vi.hoisted(() => ({ pathname: '/a/', searchParams: new URLSearchParams() }));

vi.mock('react-ga4', () => ({ default: ga }));
vi.mock('@/constants/id', () => ({ GA_MEASUREMENT_ID: 'G-TEST' }));
vi.mock('next/navigation', () => ({
  usePathname: () => navigation.pathname,
  useSearchParams: () => navigation.searchParams,
}));
vi.mock('next/web-vitals', () => ({ useReportWebVitals: () => {} }));

import { Analytics } from '@/components/ui/features/Analytics/Analytics';

const saveConsent = (value: 'accepted' | 'rejected' | null) => {
  localStorage.clear();
  if (value !== null) {
    localStorage.setItem('cookie-consent', JSON.stringify({ type: 'primitive', value }));
  }
};

beforeEach(() => {
  vi.stubEnv('NODE_ENV', 'production');
  ga.isInitialized = false;
  ga.initialize.mockReset().mockImplementation(() => {
    ga.isInitialized = true;
  });
  ga.send.mockReset();
  navigation.pathname = '/a/';
  saveConsent(null);
});

describe('Analytics', () => {
  it('同意前は初期化もページビュー送信もしない', () => {
    render(<Analytics />);

    expect(ga.initialize).not.toHaveBeenCalled();
    expect(ga.send).not.toHaveBeenCalled();
  });

  it('同意を拒否済みなら初期化もページビュー送信もしない', () => {
    saveConsent('rejected');

    render(<Analytics />);

    expect(ga.initialize).not.toHaveBeenCalled();
    expect(ga.send).not.toHaveBeenCalled();
  });

  it('同意済みの再訪では、初期化とページビュー送信を1回ずつ行う', () => {
    saveConsent('accepted');

    render(<Analytics />);

    expect(ga.initialize).toHaveBeenCalledTimes(1);
    expect(ga.send).toHaveBeenCalledTimes(1);
  });

  it('同意済みで遷移すると、ページビューを遷移ごとに1回ずつ送る', () => {
    saveConsent('accepted');
    const { rerender } = render(<Analytics />);

    navigation.pathname = '/b/';
    rerender(<Analytics />);

    expect(ga.send).toHaveBeenCalledTimes(2);
  });

  it('同じ遷移先での再描画ではページビューを重ねて送らない', () => {
    saveConsent('accepted');
    const { rerender } = render(<Analytics />);

    rerender(<Analytics />);

    expect(ga.send).toHaveBeenCalledTimes(1);
  });
});
