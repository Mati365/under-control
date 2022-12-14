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
