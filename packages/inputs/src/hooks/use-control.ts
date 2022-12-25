import { RelaxNarrowType } from '@under-control/core';
import { ControlBindMethods, ControlValue } from '../types';

import { ControlBindInputEventFn, useControlBind } from './use-control-bind';
import {
  ControlStateHookAttrs,
  ControlStateHookResult,
  useControlState,
} from './use-control-state';

export type ControlHookAttrs<V extends ControlValue> =
  ControlStateHookAttrs<V> & {
    onBlur?: ControlBindInputEventFn<V>;
  };

export type ControlHookResult<V extends ControlValue> =
  ControlStateHookResult<V> & {
    bind: ControlBindMethods<V>;
  };

export function useControl<V extends ControlValue>({
  onBlur,
  ...stateAttrs
}: ControlHookAttrs<RelaxNarrowType<V>>): ControlHookResult<
  RelaxNarrowType<V>
> {
  const state = useControlState(stateAttrs);
  const bind = useControlBind({ state, onBlur });

  return {
    bind,
    ...state,
  };
}
