import { renderHook } from '@testing-library/react';
import { useMountedRef } from './use-mounted-ref';

describe('useMountedRef', () => {
  it('should be initially mounted = true', () => {
    const { result } = renderHook(() => useMountedRef());

    expect(result.current).toStrictEqual({ current: true });
  });

  it('should be mounted = false after unmount', () => {
    const { result, unmount } = renderHook(() => useMountedRef());

    unmount();
    expect(result.current).toStrictEqual({ current: false });
  });
});
