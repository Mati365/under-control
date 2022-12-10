import { GetAllObjectPaths, GetPathObjectType } from '@under-control/core';
import { ControlledInputAttrs, ControlValue } from '../types';
import { ControlStateHookResult } from './use-control-state';

type ControlBindHookAttrs<V extends ControlValue> = {
  state: ControlStateHookResult<V>;
};

type ControlBindHookResult<V extends ControlValue> = {
  bindProp: <K extends GetAllObjectPaths<V>>(
    path: K,
  ) => ControlledInputAttrs<GetPathObjectType<V, K>>;
};

export function useControlBind<V extends ControlValue>(
  attrs: ControlBindHookAttrs<V>,
): ControlBindHookResult<V> {
  console.info(attrs);

  return null as any;
}
