import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const fetchMock = vi.fn();

// API の URL はモジュール読み込み時に確定するため、環境変数を差し替えてから読み込み直す
const loadLikesApi = async (url = 'https://likes.test') => {
  vi.stubEnv('NEXT_PUBLIC_LIKES_API_URL', url);
  vi.resetModules();

  return (await import('@/api/likes-api')).likesApi;
};

beforeEach(() => {
  vi.stubGlobal('fetch', fetchMock);
});

afterEach(() => {
  fetchMock.mockReset();
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

describe('likesApi.fetchCounts', () => {
  it('件数のオブジェクトを返す', async () => {
    const likesApi = await loadLikesApi();
    fetchMock.mockResolvedValue(new Response(JSON.stringify({ '/articles/a': 3 })));

    expect(await likesApi.fetchCounts()).toStrictEqual({ '/articles/a': 3 });
    expect(fetchMock).toHaveBeenCalledWith('https://likes.test/counts');
  });

  it('200 以外は null を返す', async () => {
    const likesApi = await loadLikesApi();
    fetchMock.mockResolvedValue(new Response('', { status: 500 }));

    expect(await likesApi.fetchCounts()).toBeNull();
  });

  it('通信に失敗したら null を返す', async () => {
    const likesApi = await loadLikesApi();
    fetchMock.mockRejectedValue(new TypeError('Failed to fetch'));

    expect(await likesApi.fetchCounts()).toBeNull();
  });

  it('API の URL が空なら通信せず null を返す', async () => {
    const likesApi = await loadLikesApi('');

    expect(await likesApi.fetchCounts()).toBeNull();
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

describe('likesApi.increment', () => {
  it('target をクエリに載せて POST し、success を返す', async () => {
    const likesApi = await loadLikesApi();
    fetchMock.mockResolvedValue(Response.json({ result: 'success' }));

    expect(await likesApi.increment('/articles/a/b')).toBe('success');
    expect(fetchMock).toHaveBeenCalledWith('https://likes.test/increment?target=%2Farticles%2Fa%2Fb', {
      method: 'POST',
    });
  });

  it('duplicate を返す', async () => {
    const likesApi = await loadLikesApi();
    fetchMock.mockResolvedValue(Response.json({ result: 'duplicate' }));

    expect(await likesApi.increment('/articles/a')).toBe('duplicate');
  });

  it('200 でも想定外のボディなら error を返す', async () => {
    const likesApi = await loadLikesApi();
    fetchMock.mockResolvedValue(Response.json({ result: 'unknown' }));

    expect(await likesApi.increment('/articles/a')).toBe('error');
  });

  it('200 でも JSON でなければ error を返す', async () => {
    const likesApi = await loadLikesApi();
    fetchMock.mockResolvedValue(new Response('<html>'));

    expect(await likesApi.increment('/articles/a')).toBe('error');
  });

  it('429 は limit を返す', async () => {
    const likesApi = await loadLikesApi();
    fetchMock.mockResolvedValue(new Response(null, { status: 429 }));

    expect(await likesApi.increment('/articles/a')).toBe('limit');
  });

  it('400 は error を返す', async () => {
    const likesApi = await loadLikesApi();
    fetchMock.mockResolvedValue(new Response(null, { status: 400 }));

    expect(await likesApi.increment('/articles/a')).toBe('error');
  });

  it('通信に失敗したら error を返す', async () => {
    const likesApi = await loadLikesApi();
    fetchMock.mockRejectedValue(new TypeError('Failed to fetch'));

    expect(await likesApi.increment('/articles/a')).toBe('error');
  });
});
