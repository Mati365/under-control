import {
  getByPath,
  isObjectWithPaths,
  setByPath,
  identity,
} from '@under-control/core';

import { pickEventValue } from '../utils';
import {
  ControlBindInputAttrs,
  ControlBindMethods,
  ControlBindPathFn,
  ControlValue,
} from '../types';

import { ControlStateHookResult } from './use-control-state';

type ControlBindHookAttrs<V extends ControlValue> = {
  state: ControlStateHookResult<V>;
};

export function useControlBind<V extends ControlValue>({
  state,
}: ControlBindHookAttrs<V>): ControlBindMethods<V> {
  const registerEntire = (): ControlBindInputAttrs<V> => ({
    value: state.getValue(),
    onChange: event => {
      state.setValue({
        merge: false,
        value: pickEventValue(event),
      });
    },
  });

  // for objects provide additional method - `path`
  // it should be not available for primitive types such as number / bool
  if (isObjectWithPaths(state.getValue())) {
    const registerPath: ControlBindPathFn<V> = (path, attrs) => {
      const stateValue = state.getValue();
      const nestedValue = getByPath(path, stateValue as any);

      return {
        value: (attrs?.input ?? identity)(nestedValue),
        onChange: (event: any) => {
          const nestedNewValue: any = (attrs?.output ?? identity)(
            pickEventValue(event),
          );

          state.setValue({
            value: setByPath(path, nestedNewValue, stateValue),
            merge: false,
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
