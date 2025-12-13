'use client';

import {useState, useEffect, useCallback} from 'react';

// A custom hook for persisting state to local storage.
export function useLocalStorage<T>(key: string, initialValue: T) {
  const readValue = useCallback((): T => {
    // Prevent build errors "ReferenceError: window is not defined"
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      // An empty string is not valid JSON, so we treat it as if the key doesn't exist.
      if (item) {
        return JSON.parse(item) as T;
      }
    } catch (error) {
      // If parsing fails, the stored data is likely corrupted.
      // Log the error and remove the invalid item from storage.
      console.warn(`Error reading localStorage key “${key}”:`, error);
      window.localStorage.removeItem(key);
    }

    // Return initialValue if no item was found or if parsing failed.
    return initialValue;
  }, [initialValue, key]);

  // State to store our value
  const [storedValue, setStoredValue] = useState<T>(readValue);

  // Custom setter function that updates state and persists to localStorage
  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      // Prevent build errors
      if (typeof window === 'undefined') {
        console.warn(
          `Tried setting localStorage key “${key}” even though no window was present.`
        );
        return;
      }

      try {
        setStoredValue(prevValue => {
            const newValue = value instanceof Function ? value(prevValue) : value;
            window.localStorage.setItem(key, JSON.stringify(newValue));
            return newValue;
        });
      } catch (error) {
        console.warn(`Error setting localStorage key “${key}”:`, error);
      }
    },
    [key]
  );

  // This effect re-reads from localStorage when the key changes (e.g. on login/logout)
  useEffect(() => {
    setStoredValue(readValue());
  }, [key, readValue]);

  return [storedValue, setValue] as const;
}
