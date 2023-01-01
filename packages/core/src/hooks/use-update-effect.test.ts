import { renderHook } from '@testing-library/react';
import { useUpdateEffect } from './use-update-effect';

describe('useUpdateEffect', () => {
  it('should call effect function only after first change of value', () => {
    const fn = jest.fn();
    const { rerender } = renderHook(({ num }: { num?: number } = {}) =>
      useUpdateEffect(fn, [num]),
    );

    expect(fn).not.toBeCalled();
    rerender();
    expect(fn).not.toBeCalled();

    rerender({ num: 2 });
    expect(fn).toBeCalledTimes(1);
  });
});
