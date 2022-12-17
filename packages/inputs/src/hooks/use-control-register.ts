import {
  GetAllObjectPaths,
  GetPathObjectType,
  useConstRefCallback,
  getByPath,
  isObjectWithPaths,
  setByPath,
} from '@under-control/core';

import { ControlledInputAttrs, ControlValue } from '../types';
import { ControlStateHookResult } from './use-control-state';

type ControlRegisterHookAttrs<V extends ControlValue> = {
  state: ControlStateHookResult<V>;
};

type ControlRegisterFn<V extends ControlValue> = <
  K extends GetAllObjectPaths<V>,
>(
  path?: K,
) => ControlledInputAttrs<GetPathObjectType<V, K>>;

type ControlRegisterHookResult<V extends ControlValue> = {
  register: ControlRegisterFn<V>;
};

export function useControlRegister<V extends ControlValue>({
  state,
}: ControlRegisterHookAttrs<V>): ControlRegisterHookResult<V> {
  const register: ControlRegisterFn<V> = useConstRefCallback(path => {
    const stateValue = state.getValue();
    const withPaths = isObjectWithPaths(stateValue) && typeof path === 'string';

    if (withPaths) {
      return {
        value: getByPath(path as any, stateValue),
        onChange: newValue => {
          state.setValue({
            value: setByPath(path, newValue, stateValue as any),
            merge: false,
          });
        },
      };
    }

    return {
      value: stateValue as any,
      onChange: newValue => {
        state.setValue({
          value: newValue as any,
          merge: false,
        });
      },
    };
  });

  return {
    register,
  };
}
