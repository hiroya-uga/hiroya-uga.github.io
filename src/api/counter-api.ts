const COUNTER_API_URL = process.env.NEXT_PUBLIC_COUNTER_API_URL ?? '';
const FETCH_TIMEOUT_MS = 3000;

type IncrementResult = 'success' | 'duplicate' | 'ignored' | 'error';

const fetchCount = async (): Promise<number | null> => {
  if (COUNTER_API_URL === '') {
    return null;
  }

  try {
    const response = await fetch(`${COUNTER_API_URL}/counts`, { signal: AbortSignal.timeout(FETCH_TIMEOUT_MS) });

    if (!response.ok) {
      return null;
    }

    const { count } = (await response.json()) as { count?: unknown };

    return typeof count === 'number' && Number.isInteger(count) && count >= 0 ? count : null;
  } catch {
    return null;
  }
};

const postIncrement = async (): Promise<IncrementResult> => {
  if (COUNTER_API_URL === '') {
    return 'error';
  }

  try {
    const response = await fetch(`${COUNTER_API_URL}/increment`, { method: 'POST' });

    if (!response.ok) {
      return 'error';
    }

    const { result } = (await response.json()) as { result?: unknown };

    switch (result) {
      case 'success':
      case 'duplicate':
      case 'ignored':
        return result;
      default:
        return 'error';
    }
  } catch {
    return 'error';
  }
};

export const counterApi = {
  fetchCount: fetchCount,
  increment: postIncrement,
};
