import React, { FC } from 'react';
import userEvent from '@testing-library/user-event';
import {
  renderHook,
  act,
  waitFor,
  render,
  screen,
  fireEvent,
} from '@testing-library/react';

import { DeferredUnlock } from '@under-control/core/test';
import { FormHookAttrs, useForm } from './use-form';

const DEFAULT_HOOK_ATTRS: FormHookAttrs<any> = {
  defaultValue: {},
  onSubmit: () => {},
};

describe('useForm', () => {
  describe('isDirty', () => {
    it('hook starts with false dirty value', () => {
      const { result } = renderHook(() => useForm(DEFAULT_HOOK_ATTRS));

      expect(result.current.isDirty).toBe(false);
    });

    it('uses default dirty boolean for attribute', () => {
      const { result } = renderHook(() =>
        useForm({
          ...DEFAULT_HOOK_ATTRS,
          initialDirty: true,
        }),
      );

      expect(result.current.isDirty).toBe(true);
    });

    it('setValue should set dirty flag to true', async () => {
      const { result } = renderHook(() => useForm(DEFAULT_HOOK_ATTRS));

      await act(() => {
        result.current.setValue({
          value: {
            abc: 2,
          },
        });
      });

      expect(result.current.getValue()).toStrictEqual({ abc: 2 });
      expect(result.current.isDirty).toBe(true);
    });

    it('input change should set dirty flag to true', async () => {
      const { result } = renderHook(() => useForm(DEFAULT_HOOK_ATTRS));

      await act(() => {
        result.current.bind.entire().onChange({ a: 2 });
      });

      expect(result.current.getValue()).toStrictEqual({ a: 2 });
      expect(result.current.isDirty).toBe(true);
    });
  });

  describe('submit', () => {
    it('calling submit() triggers loading state', async () => {
      const mutex = new DeferredUnlock<number>();
      const onSubmit = jest.fn(async () => mutex.promise);

      const { result } = renderHook(() =>
        useForm({
          defaultValue: 456,
          onSubmit,
        }),
      );

      await act(() => {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        result.current.submit();
      });

      expect(onSubmit).toHaveBeenNthCalledWith(1, 456);
      expect(result.current.submitting).toBe(true);

      mutex.resolve(123);

      await waitFor(() => {
        expect(result.current.submitting).toBe(false);
      });
    });

    it('react form handler works', async () => {
      const onSubmit = jest.fn();

      const Component: FC = () => {
        const { bind, handleSubmitEvent } = useForm({
          defaultValue: {
            a: '',
            b: '',
          },
          onSubmit,
        });

        return (
          <form onSubmit={handleSubmitEvent}>
            <input type="text" data-testid="a" {...bind.path('a')} />
            <input type="text" data-testid="b" {...bind.path('b')} />
            <input data-testid="submit" type="submit" value="Submit" />
          </form>
        );
      };

      render(<Component />);

      await userEvent.type(screen.getByTestId('a'), 'Test A');
      await userEvent.type(screen.getByTestId('b'), 'Test B');
      fireEvent.submit(screen.getByTestId('submit'));

      await waitFor(() => {
        expect(onSubmit).toHaveBeenNthCalledWith(1, {
          a: 'Test A',
          b: 'Test B',
        });
      });
    });
  });
});
