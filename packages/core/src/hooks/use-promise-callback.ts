/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { useState, useRef, useCallback } from 'react';

import type { Nullable } from '../types';

import { identity } from '../utils';
import { useMountedRef } from './use-mounted-ref';

type ExtractAsyncReturnType<T extends (...args: any) => any> = Awaited<
  ReturnType<T>
>;

export type PromiseState<T, E> = {
  result?: T;
  error?: E | undefined | null | true;
  loading: boolean;
};

export type PromiseCallbackAttrs<T, E> = {
  initialPromiseState?: PromiseState<T, E>;
  rethrow?: boolean;
  resultParserFn?: (val: any) => T;
  errorSelectorFn?: Nullable<(e: any) => E>;
};

export type PromiseCallbackResult<F extends (...args: any) => any, E = any> = [
  F,
  PromiseState<Awaited<ReturnType<F>>, E>,
];

export const usePromiseCallback = <F extends (...args: any) => any, E = any>(
  promiseFn: F,
  {
    initialPromiseState,
    rethrow = true,
    resultParserFn = identity,
    errorSelectorFn,
  }: PromiseCallbackAttrs<ExtractAsyncReturnType<F>, E> = {},
): PromiseCallbackResult<F, E> => {
  const [promiseState, setPromiseState] = useState<
    PromiseState<ExtractAsyncReturnType<F>, E>
  >(
    initialPromiseState ?? {
      loading: false,
    },
  );

  const mountedRef = useMountedRef();
  const promiseFnRef = useRef<(...args: any[]) => Promise<any>>();
  const lastCallID = useRef<number>();

  promiseFnRef.current = async (...args: any[]) => {
    const callID = Date.now();
    lastCallID.current = callID;

    try {
      setPromiseState({
        ...promiseState,
        error: null,
        loading: true,
      });

      const result = resultParserFn(await promiseFn(...args));

      if (mountedRef.current && lastCallID.current === callID) {
        setPromiseState({
          result,
          loading: false,
        });
      }

      return result;
    } catch (e) {
      if (lastCallID.current === callID && mountedRef.current) {
        setPromiseState({
          loading: false,
          error: errorSelectorFn?.(e) ?? (e as any),
        });
      }

      if (rethrow) {
        throw e;
      }
    }

    return null;
  };

  const fn = useCallback(
    async (...args: any[]) => promiseFnRef.current?.(...args),
    [],
  );

  return [fn as F, promiseState as any];
};
