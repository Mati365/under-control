/* eslint-disable @typescript-eslint/no-unsafe-argument, @typescript-eslint/ban-types */
import { useRef } from 'react';

import {
  getByPath,
  isObjectWithPaths,
  setByPath,
  identity,
  type GetPathObjectType,
  type GetAllObjectPaths,
} from '@under-control/core';

import { pickEventValue } from '../utils';
import type {
  ControlBindInputAttrs,
  ControlBindMethods,
  ControlBindPathFn,
  ControlValue,
} from '../types';

import type { ControlStateHookResult } from './use-control-state';

type ControlBindCacheStore = Record<
  string,
  {
    current: Function;
    cached: Function;
  }
>;

export type ControlBindInputEventAttrs<
  V extends ControlValue,
  P extends GetAllObjectPaths<V> = GetAllObjectPaths<V>,
> =
  | {
      path: P;
      value: GetPathObjectType<V, P>;
    }
  | {
      value: V;
      path: null;
    };

export type ControlBindInputEventFn<V extends ControlValue> = (
  attrs: ControlBindInputEventAttrs<V>,
) => void;

export type ControlBindHookAttrs<V extends ControlValue> = {
  state: ControlStateHookResult<V>;
  onBlur?: ControlBindInputEventFn<V>;
};

export function useControlBind<V extends ControlValue>({
  state,
  onBlur,
}: ControlBindHookAttrs<V>): ControlBindMethods<V> {
  const callbackCacheRef = useRef<ControlBindCacheStore>({});

  // cache `onChange` / other events to prevent unnecessary rerenders
  const constRefCallback = <T extends Function>(
    { key, skip }: { key: string; skip?: boolean },
    fn: T,
  ): T => {
    if (skip) {
      return fn;
    }

    const { current: store } = callbackCacheRef;
    if (key in store) {
      store[key].current = fn;
    } else {
      store[key] = {
        current: fn,
        cached: (...args: any[]) => store[key].current(...args),
      };
    }

    return store[key].cached as T;
  };

  // register input that writes directly to whole input state
  const registerEntire = (): ControlBindInputAttrs<V> => {
    const value = state.getValue();

    return {
      value,
      onChange: constRefCallback({ key: '@onChange' }, event => {
        state.setValue({
          merge: false,
          value: pickEventValue(event),
        });
      }),
      onBlur: constRefCallback({ key: '@onBlur' }, () => {
        onBlur?.({
          path: null,
          value,
        });
      }),
    };
  };

  const registerMerge = (): ControlBindInputAttrs<V, Partial<V>> => {
    const value = state.getValue();

    return {
      value,
      onChange: constRefCallback({ key: '@merge/onChange' }, event => {
        state.setValue({
          merge: true,
          value: pickEventValue(event),
        });
      }),
      onBlur: constRefCallback({ key: '@merge/onBlur' }, () => {
        onBlur?.({
          path: null,
          value,
        });
      }),
    };
  };

  // for objects provide additional method - `path`
  // it should be not available for primitive types such as number / bool
  if (isObjectWithPaths(state.getValue())) {
    const registerPath: ControlBindPathFn<V> = (path, attrs) => {
      const stateValue = state.getValue();
      const nestedValue = (attrs?.input ?? identity)(
        getByPath(path, stateValue as any),
      );

      return {
        value: nestedValue,
        onChange: constRefCallback(
          { key: `@onChange/${path}`, skip: attrs?.noCache },
          (event: any) => {
            const nestedNewValue: any = (attrs?.output ?? identity)(
              pickEventValue(event),
            );

            let newGlobalValue = setByPath(path, nestedNewValue, stateValue);
            if (attrs?.relatedInputs) {
              newGlobalValue = attrs.relatedInputs({
                controlValue: nestedNewValue,
                newControlValue: nestedNewValue,
                globalValue: stateValue,
                newGlobalValue,
              });
            }

            state.setValue({
              value: newGlobalValue,
              merge: false,
            });
          },
        ),
        onBlur: constRefCallback(
          { key: `@onBlur/${path}`, skip: attrs?.noCache },
          () => {
            onBlur?.({
              value: nestedValue,
              path,
            });
          },
        ),
      };
    };

    return {
      merged: registerMerge,
      path: registerPath,
      entire: registerEntire,
    } as unknown as ControlBindMethods<V>;
  }

  return {
    merged: registerMerge,
    entire: registerEntire,
  } as unknown as ControlBindMethods<V>;
}
