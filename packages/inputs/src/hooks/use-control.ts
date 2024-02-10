import type { RelaxNarrowType } from '@under-control/core';
import type { ControlBindMethods, ControlValue } from '../types';

import {
  useControlBind,
  type ControlBindInputEventFn,
} from './use-control-bind';
import {
  useControlState,
  type ControlStateHookAttrs,
  type ControlStateHookResult,
} from './use-control-state';

export type ControlHookAttrs<V extends ControlValue> =
  ControlStateHookAttrs<V> & {
    onBlur?: ControlBindInputEventFn<V>;
  };

export type ControlHookResult<V extends ControlValue> =
  ControlStateHookResult<V> & {
    bind: ControlBindMethods<V>;
  };

/**
 * RelaxNarrowType is used to convert constants passed in `V` to for example `number`.
 * Example:
 *  useControl({
 *    ...
 *    defaultValue: {
 *      a: {
 *        b: 2,
 *      }
 *    }
 *  })
 *
 * In this scenario TS resolves `a.b` property type to `2` instead of `number`.
 * After apply `RelaxNarrowType` type is converted to `number`.
 */
export function useControlStrict<V extends ControlValue>({
  onBlur,
  ...stateAttrs
}: ControlHookAttrs<V>): ControlHookResult<V> {
  const state = useControlState(stateAttrs);
  const bind = useControlBind({ state, onBlur });

  return {
    bind,
    ...state,
  };
}

export const useControl = <V extends ControlValue>(
  attrs: ControlHookAttrs<RelaxNarrowType<V>>,
): ControlHookResult<RelaxNarrowType<V>> => useControlStrict(attrs);
