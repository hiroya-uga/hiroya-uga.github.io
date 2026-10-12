const LIKES_API_URL = process.env.NEXT_PUBLIC_LIKES_API_URL ?? '';

type LikeResult = 'success' | 'duplicate' | 'limit' | 'error';

const fetchCounts = async (): Promise<Record<string, number> | null> => {
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

const postLike = async (target: string): Promise<LikeResult> => {
  if (LIKES_API_URL === '') {
    return 'error';
  }

  try {
    const url = `${LIKES_API_URL}/increment?${new URLSearchParams({ target })}`;
    const response = await fetch(url, {
      method: 'POST',
    });

    if (response.status === 429) {
      return 'limit';
    }

    if (!response.ok) {
      return 'error';
    }

    const { result } = (await response.json()) as { result?: unknown };

    return result === 'success' || result === 'duplicate' ? result : 'error';
  } catch {
    return 'error';
  }
};

export const likesApi = {
  fetchCounts: fetchCounts,
  increment: postLike,
};
