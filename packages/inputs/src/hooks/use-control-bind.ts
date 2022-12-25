import {
  GetAllObjectPaths,
  getByPath,
  isObjectWithPaths,
  setByPath,
  identity,
  GetPathObjectType,
} from '@under-control/core';

import { pickEventValue } from '../utils';
import {
  ControlBindInputAttrs,
  ControlBindMethods,
  ControlBindPathFn,
  ControlValue,
} from '../types';

import { ControlStateHookResult } from './use-control-state';

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
  const registerEntire = (): ControlBindInputAttrs<V> => {
    const value = state.getValue();

    return {
      value,
      onChange: event => {
        state.setValue({
          merge: false,
          value: pickEventValue(event),
        });
      },
      onBlur: () => {
        onBlur?.({
          path: null,
          value,
        });
      },
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
        onChange: (event: any) => {
          const nestedNewValue: any = (attrs?.output ?? identity)(
            pickEventValue(event),
          );

          state.setValue({
            value: setByPath(path, nestedNewValue, stateValue),
            merge: false,
          });
        },
        onBlur: () => {
          onBlur?.({
            value: nestedValue,
            path,
          });
        },
      };
    };

    return {
      path: registerPath,
      entire: registerEntire,
    } as unknown as ControlBindMethods<V>;
  }

  return {
    entire: registerEntire,
  } as unknown as ControlBindMethods<V>;
}
