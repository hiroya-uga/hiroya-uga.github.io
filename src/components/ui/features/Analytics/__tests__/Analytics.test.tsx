import { render } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const ga = vi.hoisted(() => ({
  isInitialized: false,
  initialize: vi.fn(),
  send: vi.fn(),
}));
const counter = vi.hoisted(() => ({ increment: vi.fn() }));
const navigation = vi.hoisted(() => ({ pathname: '/a/', searchParams: new URLSearchParams() }));

vi.mock('@/api', () => ({ counterApi: counter }));
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
  counter.increment.mockReset().mockResolvedValue(1);
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

  it('同意の有無にかかわらず、サイト内の遷移ではアクセス数を加算せず、表示時に1回だけ加算する', () => {
    saveConsent('rejected');
    const { rerender } = render(<Analytics />);

    navigation.pathname = '/b/';
    rerender(<Analytics />);

    expect(counter.increment).toHaveBeenCalledTimes(1);
  });
});
