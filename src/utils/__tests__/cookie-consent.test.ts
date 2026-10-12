import { beforeEach, describe, expect, it, vi } from 'vitest';

const ga = vi.hoisted(() => ({
  isInitialized: false,
  initialize: vi.fn(),
  send: vi.fn(),
}));

vi.mock('react-ga4', () => ({ default: ga }));
vi.mock('@/constants/id', () => ({ GA_MEASUREMENT_ID: 'G-TEST' }));

import { applyCookieConsent, initGA, sendPageview } from '@/utils/cookie-consent';

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
  saveConsent(null);
});

describe('initGA', () => {
  it('同意が保存されていなければ初期化しない', () => {
    initGA();

    expect(ga.initialize).not.toHaveBeenCalled();
  });

  it('同意を拒否していれば初期化しない', () => {
    saveConsent('rejected');

    initGA();

    expect(ga.initialize).not.toHaveBeenCalled();
  });

  it('同意していれば計測IDで初期化する', () => {
    saveConsent('accepted');

    initGA();

    expect(ga.initialize).toHaveBeenCalledWith('G-TEST', { gtagOptions: { send_page_view: false } });
  });

  it('config の自動ページビュー送信を無効にして初期化する', () => {
    saveConsent('accepted');

    initGA();

    expect(ga.initialize.mock.calls[0][1]).toStrictEqual({ gtagOptions: { send_page_view: false } });
  });

  it('同意していても本番環境以外では初期化しない', () => {
    vi.stubEnv('NODE_ENV', 'development');
    saveConsent('accepted');

    initGA();

    expect(ga.initialize).not.toHaveBeenCalled();
  });

  it('初期化だけではページビューを送らない', () => {
    saveConsent('accepted');

    initGA();

    expect(ga.send).not.toHaveBeenCalled();
  });
});

describe('sendPageview', () => {
  it('初期化されていなければ送らない', () => {
    sendPageview();

    expect(ga.send).not.toHaveBeenCalled();
  });

  it('初期化済みならページビューを1回送る', () => {
    ga.isInitialized = true;

    sendPageview();

    expect(ga.send).toHaveBeenCalledTimes(1);
    expect(ga.send).toHaveBeenCalledWith({ hitType: 'pageview', page: window.location.pathname });
  });
});

describe('sendPageview のページ指定', () => {
  it('クエリがあれば、パスと?付きのクエリをつなげて送る', () => {
    ga.isInitialized = true;
    window.history.pushState({}, '', '/a/?x=1');

    sendPageview();

    expect(ga.send).toHaveBeenCalledWith({ hitType: 'pageview', page: '/a/?x=1' });
    window.history.pushState({}, '', '/');
  });
});

describe('applyCookieConsent', () => {
  it('同意すると、保存・初期化・ページビュー送信を1回ずつ行う', () => {
    applyCookieConsent('accepted');

    expect(localStorage.getItem('cookie-consent')).toBe(JSON.stringify({ type: 'primitive', value: 'accepted' }));
    expect(ga.initialize).toHaveBeenCalledTimes(1);
    expect(ga.send).toHaveBeenCalledTimes(1);
  });

  it('拒否すると、保存だけ行い、初期化もページビュー送信もしない', () => {
    applyCookieConsent('rejected');

    expect(localStorage.getItem('cookie-consent')).toBe(JSON.stringify({ type: 'primitive', value: 'rejected' }));
    expect(ga.initialize).not.toHaveBeenCalled();
    expect(ga.send).not.toHaveBeenCalled();
  });

  it('同意後に拒否へ切り替えても、以降の初期化は行わない', () => {
    applyCookieConsent('accepted');
    ga.initialize.mockClear();

    applyCookieConsent('rejected');
    initGA();

    expect(ga.initialize).not.toHaveBeenCalled();
  });
});
