import { useCallback, useRef } from 'react';

export function useConstRefCallback<A extends unknown[], R>(
  fn: (...args: A) => R,
): typeof fn {
  const callbackRef = useRef(fn);

  callbackRef.current = fn;

  return useCallback((...args: A): R => callbackRef.current(...args), []);
}
