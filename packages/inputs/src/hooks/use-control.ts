import { RelaxNarrowType } from '@under-control/core';
import { ControlValue } from '../types';
import { ControlBindHookResult, useControlBind } from './use-control-bind';
import {
  ControlStateHookAttrs,
  ControlStateHookResult,
  useControlState,
} from './use-control-state';

export type ControlHookAttrs<V> = ControlStateHookAttrs<V>;
export type ControlHookResult<V> = ControlStateHookResult<V> & {
  bind: ControlBindHookResult<V>;
};

export function useControl<R extends ControlValue>(
  attrs: ControlHookAttrs<RelaxNarrowType<R>>,
): ControlHookResult<RelaxNarrowType<R>> {
  const state = useControlState(attrs);
  const bind = useControlBind({ state });

  return {
    bind,
    ...state,
  };
}
