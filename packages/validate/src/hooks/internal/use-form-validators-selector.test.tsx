import { renderHook } from '@testing-library/react';
import { useFormValidatorsSelector } from './use-form-validators-selector';

describe('useFormValidatorsSelector', () => {
  it('should call selector function if provided', () => {
    const validators = jest.fn();

    renderHook(() => useFormValidatorsSelector(validators));
    expect(validators).toHaveBeenNthCalledWith(1, {
      all: expect.any(Function),
      path: expect.any(Function),
    });
  });

  it('should return the same validators if not function', () => {
    const { result } = renderHook(() => useFormValidatorsSelector([() => []]));
    expect(result.current).toMatchObject([expect.any(Function)]);
  });
});
