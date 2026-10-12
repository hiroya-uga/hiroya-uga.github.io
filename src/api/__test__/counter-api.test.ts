import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const fetchMock = vi.fn();

// API の URL はモジュール読み込み時に確定するため、環境変数を差し替えてから読み込み直す
const loadCounterApi = async (url = 'https://counter.test') => {
  vi.stubEnv('NEXT_PUBLIC_COUNTER_API_URL', url);
  vi.resetModules();

  return (await import('@/api/counter-api')).counterApi;
};

beforeEach(() => {
  vi.stubGlobal('fetch', fetchMock);
});

afterEach(() => {
  fetchMock.mockReset();
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

describe('counterApi.fetchCount', () => {
  it('GET /counts の件数を返す', async () => {
    const counterApi = await loadCounterApi();
    fetchMock.mockResolvedValue(new Response(JSON.stringify({ count: 50930 })));

    expect(await counterApi.fetchCount()).toBe(50930);
    expect(fetchMock).toHaveBeenCalledWith('https://counter.test/counts', { signal: expect.any(AbortSignal) });
  });

  it('URL が未設定なら通信せず null を返す', async () => {
    const counterApi = await loadCounterApi('');

    expect(await counterApi.fetchCount()).toBeNull();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('200 以外は null を返す', async () => {
    const counterApi = await loadCounterApi();
    fetchMock.mockResolvedValue(new Response('', { status: 500 }));

    expect(await counterApi.fetchCount()).toBeNull();
  });

  it('一定時間内に応答がなければ中断して null を返す', async () => {
    const counterApi = await loadCounterApi();
    fetchMock.mockImplementation(
      (_url: string, { signal }: { signal: AbortSignal }) =>
        new Promise((_, reject) => signal.addEventListener('abort', () => reject(signal.reason))),
    );
    vi.useFakeTimers();

    const result = counterApi.fetchCount();
    await vi.advanceTimersByTimeAsync(3000);

    expect(await result).toBeNull();
    vi.useRealTimers();
  });

  it('通信に失敗したら null を返す', async () => {
    const counterApi = await loadCounterApi();
    fetchMock.mockRejectedValue(new Error('network'));

    expect(await counterApi.fetchCount()).toBeNull();
  });

  it.each([{ count: -1 }, { count: 1.5 }, { count: '10' }, {}])('件数が不正な値 %o なら null を返す', async (body) => {
    const counterApi = await loadCounterApi();
    fetchMock.mockResolvedValue(new Response(JSON.stringify(body)));

    expect(await counterApi.fetchCount()).toBeNull();
  });
});

describe('counterApi.increment', () => {
  it.each(['success', 'duplicate', 'ignored'])('POST /increment の結果 %s を返す', async (result) => {
    const counterApi = await loadCounterApi();
    fetchMock.mockResolvedValue(new Response(JSON.stringify({ result })));

    expect(await counterApi.increment()).toBe(result);
    expect(fetchMock).toHaveBeenCalledWith('https://counter.test/increment', { method: 'POST' });
  });

  it('URL が未設定なら通信せず error を返す', async () => {
    const counterApi = await loadCounterApi('');

    expect(await counterApi.increment()).toBe('error');
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('200 以外は error を返す', async () => {
    const counterApi = await loadCounterApi();
    fetchMock.mockResolvedValue(new Response('', { status: 500 }));

    expect(await counterApi.increment()).toBe('error');
  });

  it('通信に失敗したら error を返す', async () => {
    const counterApi = await loadCounterApi();
    fetchMock.mockRejectedValue(new Error('network'));

    expect(await counterApi.increment()).toBe('error');
  });

  it('想定外の結果は error を返す', async () => {
    const counterApi = await loadCounterApi();
    fetchMock.mockResolvedValue(new Response(JSON.stringify({ result: 'limit' })));

    expect(await counterApi.increment()).toBe('error');
  });
});
