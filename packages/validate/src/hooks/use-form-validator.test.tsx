/* eslint-disable @typescript-eslint/no-floating-promises */
import { renderHook, waitFor } from '@testing-library/react';
import { expectTypeOf } from 'expect-type';
import { act } from 'react-dom/test-utils';

import { error } from '../utils';
import { useFormValidator } from './use-form-validator';

type DefaultMockObj = {
  a: {
    b: number;
  };
};

describe('useFormValidator', () => {
  it('should not crash if validators list is blank', async () => {
    const { result } = renderHook(() => useFormValidator<DefaultMockObj>({}));

    await act(() => {
      result.current.validate({ a: { b: 2 } });
    });

    await waitFor(() => {
      expect(result.current.validating).toBe(false);
      expect(result.current.errors.all).toMatchObject([]);
    });
  });

  it('should perform validation all fields', async () => {
    const { result } = renderHook(() =>
      useFormValidator<DefaultMockObj>({
        validators: ({ global }) => [
          global(({ value }) => {
            if (value.a.b !== 2) {
              return;
            }

            expectTypeOf(value).toEqualTypeOf<DefaultMockObj>();
            return [error('Error 2'), error('Error 3')];
          }),
        ],
      }),
    );

    await act(() => {
      result.current.validate({ a: { b: 2 } });
    });

    await waitFor(() => {
      expect(result.current.errors.all).toMatchObject([
        error('Error 2', null, null),
        error('Error 3', null, null),
      ]);
    });

    await act(() => {
      result.current.validate({ a: { b: 3 } });
    });

    await waitFor(() => {
      expect(result.current.errors.all).toMatchObject([]);
    });
  });

  it('should perform validation on specified fields', async () => {
    const { result } = renderHook(() =>
      useFormValidator<DefaultMockObj>({
        validators: ({ path }) => [
          path('a.b', ({ value }) => {
            if (value !== 2) {
              return;
            }

            expectTypeOf(value).toEqualTypeOf<number>();

            return error('Error 2');
          }),
        ],
      }),
    );

    await act(() => {
      result.current.validate({ a: { b: 2 } });
    });

    await waitFor(() => {
      expect(result.current.errors.all).toMatchObject([
        error('Error 2', null, 'a.b'),
      ]);
    });
  });

  it('should validate again specified fields preserving other errors', async () => {
    type MockObject = {
      a: number;
      b: number;
    };

    const { result } = renderHook(() =>
      useFormValidator<MockObject>({
        validators: ({ path }) => [
          path('a', ({ value }) => {
            if (value === 3) {
              return;
            }

            return error('Error a');
          }),
          path('b', ({ value }) => {
            if (value === 4) {
              return;
            }

            return error('Error b');
          }),
        ],
      }),
    );

    await act(() => {
      result.current.validate({ a: 2, b: 3 });
    });

    await waitFor(() => {
      expect(result.current.errors.all).toMatchObject([
        error('Error a', null, 'a'),
        error('Error b', null, 'b'),
      ]);
    });

    await act(() => {
      result.current.validate({ a: 2, b: 4 }, ['b']);
    });

    await waitFor(() => {
      expect(result.current.errors.all).toMatchObject([
        error('Error a', null, 'a'),
      ]);
    });

    await act(() => {
      result.current.validate({ a: 3, b: 4 });
    });

    await waitFor(() => {
      expect(result.current.errors.all).toMatchObject([]);
    });
  });
});
