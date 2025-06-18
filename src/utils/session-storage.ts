type Key = 'welcome-message-viewed';
type Value = {
  'welcome-message-viewed': 'true';
};

export const setSessionStorage = <T extends Key>(key: T, value: Value[T]) => {
  try {
    sessionStorage.setItem(key, value);
  } catch (error) {
    console.error(`Error setting session storage for key "${key}":`, error);
  }
};

export const getSessionStorage = <T extends Key>(key: T): Value[T] | null => {
  try {
    return sessionStorage.getItem(key) as Value[T] | null;
  } catch (error) {
    console.error(`Error setting session storage for key "${key}":`, error);
  }

  return null;
};
