import {
  GetAllObjectPaths,
  GetPathObjectType,
  getByPath,
  isObjectWithPaths,
  setByPath,
  ObjectWithPaths,
} from '@under-control/core';

import { pickEventValue } from '../utils';

import { ControlledInputAttrs, ControlValue } from '../types';
import { ControlStateHookResult } from './use-control-state';

type ControlBindHookAttrs<V extends ControlValue> = {
  state: ControlStateHookResult<V>;
};

type ControlBindPathFn<V extends ControlValue> = <
  K extends GetAllObjectPaths<V>,
>(
  path: K,
) => ControlledInputAttrs<GetPathObjectType<V, K>>;

export type ControlBindHookResult<V> = {
  entire: () => ControlledInputAttrs<V>;
} & (V extends ObjectWithPaths
  ? {
      path: ControlBindPathFn<V>;
    }
  : {});

export function useControlBind<V extends ControlValue>({
  state,
}: ControlBindHookAttrs<V>): ControlBindHookResult<V> {
  const registerEntire = (): ControlledInputAttrs<V> => ({
    value: state.getValue(),
    onChange: event => {
      state.setValue({
        merge: false,
        value: pickEventValue(event),
      });
    },
  });

  if (isObjectWithPaths(state.getValue())) {
    const registerPath: ControlBindPathFn<V> = path => {
      const stateValue = state.getValue();

      return {
        value: getByPath(path, stateValue as any),
        onChange: (event: any) => {
          state.setValue({
            value: setByPath(path, pickEventValue(event), stateValue),
            merge: false,
          });
        },
      };
    };

    return {
      path: registerPath,
      entire: registerEntire,
    } as unknown as ControlBindHookResult<V>;
  }

  return {
    entire: registerEntire,
  } as unknown as ControlBindHookResult<V>;
}
