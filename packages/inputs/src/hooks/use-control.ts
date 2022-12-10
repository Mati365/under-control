import { ControlValue } from '../types';
import {
  ControlStateHookAttrs,
  ControlStateHookResult,
  useControlState,
} from './use-control-state';

export type ControlHookAttrs<V extends ControlValue> = ControlStateHookAttrs<V>;
export type ControlHookResult<V extends ControlValue> =
  ControlStateHookResult<V>;

export function useControl<V extends ControlValue>(
  attrs: ControlHookAttrs<V>,
): ControlHookResult<V> {
  const result = useControlState(attrs);

  return result;
}
