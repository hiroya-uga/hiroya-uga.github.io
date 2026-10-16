const LIKES_API_URL = process.env.NEXT_PUBLIC_LIKES_API_URL ?? '';

interface LikeIncrementResponse {
  status: 'success' | 'duplicate' | 'limit' | 'error';
  // サーバーが確定した加算後の件数。success / duplicate 以外では null
  count: number | null;
}

const failed = (status: 'limit' | 'error'): LikeIncrementResponse => ({
  status,
  count: null,
});

const getCounts = async (): Promise<Record<string, number> | null> => {
  if (LIKES_API_URL === '') {
    return null;
  }

  try {
    const response = await fetch(`${LIKES_API_URL}/counts`);

    return response.ok ? ((await response.json()) as Record<string, number>) : null;
  } catch {
    return null;
  }
};

const postLike = async (target: string): Promise<LikeIncrementResponse> => {
  if (LIKES_API_URL === '') {
    return failed('error');
  }

  try {
    const url = `${LIKES_API_URL}/increment?${new URLSearchParams({ target })}`;
    const response = await fetch(url, {
      method: 'POST',
    });

    if (response.status === 429) {
      return failed('limit');
    }

    if (!response.ok) {
      return failed('error');
    }

    const { status, count } = (await response.json()) as {
      status?: unknown;
      count?: unknown;
    };

    if (status !== 'success' && status !== 'duplicate') {
      return failed('error');
    }

    return {
      status,
      count: typeof count === 'number' ? count : null,
    };
  } catch {
    return failed('error');
  }
};

export const likesApi = {
  fetchCounts: getCounts,
  increment: postLike,
};
