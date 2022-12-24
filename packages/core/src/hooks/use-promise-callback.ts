import { useState, useRef, useCallback } from 'react';

import { Nullable } from '../types';

import { identity } from '../utils';
import { useMountedRef } from './use-mounted-ref';

export type PromiseState<T, E> = {
  result?: T;
  error?: E | undefined | null | true;
  loading?: boolean;
};

export type PromiseCallbackAttrs<T, E> = {
  initialPromiseState?: PromiseState<T, E>;
  rethrow?: boolean;
  resultParserFn?: (val: any) => T;
  errorSelectorFn?: Nullable<(e: any) => E>;
};

type PromiseCallbackResult<T, E, F> = [F, PromiseState<T, E>];

export const usePromiseCallback = <
  F extends (...args: any[]) => any,
  T = ReturnType<F>,
  E = any,
>(
  promiseFn: F,
  {
    initialPromiseState,
    rethrow = true,
    resultParserFn = identity,
    errorSelectorFn,
  }: PromiseCallbackAttrs<T, E> = {},
): PromiseCallbackResult<T, E, F> => {
  const [promiseState, setPromiseState] = useState<PromiseState<T, E>>(
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
    (...args: any[]) => promiseFnRef.current?.(...args),
    [],
  );

  return [fn as F, promiseState];
};
