import { renderHook } from '@testing-library/react';
import { useUpdateEffect } from './use-update-effect';

describe('useUpdateEffect', () => {
  it('should call effect function only after first change of value', () => {
    const fn = jest.fn();
    const { rerender } = renderHook(({ num }: { num?: number } = {}) =>
      // eslint-disable-next-line @typescript-eslint/no-confusing-void-expression
      useUpdateEffect(fn, [num]),
    );

    expect(fn).not.toHaveBeenCalled();
    rerender();
    expect(fn).not.toHaveBeenCalled();

    rerender({ num: 2 });
    expect(fn).toHaveBeenCalledTimes(1);
  });
});
