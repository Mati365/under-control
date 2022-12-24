/* eslint-disable @typescript-eslint/no-floating-promises */
import { waitFor } from '@testing-library/dom';
import { act, renderHook } from '@testing-library/react';

import { DeferredUnlock } from '../../test/deferred-unlock';
import { Nullable } from '../types';
import { usePromiseCallback } from './use-promise-callback';

describe('usePromiseCallback hook', () => {
  it('should perform transitions between loading states in simple promise', async () => {
    let callbackFnResultPromise: Promise<Nullable<number>> | null = null;
    const mutex = new DeferredUnlock<number>();
    const { result } = renderHook(() =>
      usePromiseCallback(async () => mutex.promise),
    );

    await act(() => {
      callbackFnResultPromise = result.current[0]();
    });

    await waitFor(() => {
      expect(result.current[1]).toMatchObject({
        loading: true,
      });
    });

    await act(async () => {
      mutex.resolve(123);
      await mutex.promise;
    });

    await waitFor(async () => {
      expect(result.current[1]).toMatchObject({
        result: 123,
        loading: false,
      });

      expect(await callbackFnResultPromise).toEqual(123);
    });
  });

  it('should handle errors without rethrowing', async () => {
    const mutex = new DeferredUnlock<number>();
    const { result } = renderHook(() =>
      usePromiseCallback(async () => mutex.promise, { rethrow: false }),
    );

    await act(() => {
      result.current[0]();
    });

    await waitFor(() => {
      expect(result.current[1]).toMatchObject({
        loading: true,
      });
    });

    await act(async () => {
      try {
        mutex.reject('error :(');
        await mutex.promise;
      } catch (e) {}
    });

    await waitFor(() => {
      expect(result.current[1]).toMatchObject({
        loading: false,
        error: 'error :(',
      });
    });
  });

  it('should handle errors with rethrowing', async () => {
    const exceptionHandleFn = jest.fn();
    const mutex = new DeferredUnlock<number>();

    const { result } = renderHook(() =>
      usePromiseCallback(async () => mutex.promise),
    );

    await act(() => {
      result.current[0]().catch(exceptionHandleFn);
    });

    await waitFor(() => {
      expect(result.current[1]).toMatchObject({
        loading: true,
      });
    });

    await act(async () => {
      try {
        mutex.reject('error :(');
        await mutex.promise;
      } catch (e) {}
    });

    await waitFor(() => {
      expect(exceptionHandleFn).toBeCalled();
      expect(result.current[1]).toMatchObject({
        loading: false,
        error: 'error :(',
      });
    });
  });

  it('should return result only from last called promise', async () => {
    const mutex = [new DeferredUnlock<number>(), new DeferredUnlock<number>()];

    const callNo = { current: 0 };
    const { result } = renderHook(() =>
      usePromiseCallback(async () => mutex[callNo.current++].promise),
    );

    await act(() => {
      const [fn] = result.current;

      fn();
      fn();

      mutex[1].resolve(2);
      mutex[0].resolve(1);
    });

    await waitFor(() => {
      expect(result.current[1]).toMatchObject({
        loading: false,
        result: 2,
      });
    });
  });

  it('should return error only from last called promise', async () => {
    const mutex = [new DeferredUnlock<number>(), new DeferredUnlock<number>()];

    const callNo = { current: 0 };
    const { result } = renderHook(() =>
      usePromiseCallback(async () => mutex[callNo.current++].promise, {
        rethrow: false,
      }),
    );

    await act(() => {
      const [fn] = result.current;

      fn();
      fn();

      mutex[1].reject(2);
      mutex[0].reject(1);
    });

    await waitFor(() => {
      expect(result.current[1]).toMatchObject({
        loading: false,
        error: 2,
      });
    });
  });

  it('should use error selector to map errors', async () => {
    const mutex = new DeferredUnlock<number>();
    const { result } = renderHook(() =>
      usePromiseCallback(async () => mutex.promise, {
        rethrow: false,
        errorSelectorFn: e => +e * 2,
      }),
    );

    await act(() => {
      const [fn] = result.current;

      fn();
      mutex.reject(3);
    });

    await waitFor(() => {
      expect(result.current[1]).toMatchObject({
        loading: false,
        error: 6,
      });
    });
  });
});
