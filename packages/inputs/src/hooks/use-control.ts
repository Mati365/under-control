import { ControlValue } from '../types';
import {
  ControlStateHookAttrs,
  ControlStateHookResult,
  useControlState,
} from './use-control-state';

export type ControlHookAttrs<V> = ControlStateHookAttrs<V>;
export type ControlHookResult<V> = ControlStateHookResult<V>;

export function useControl<V extends ControlValue>(
  attrs: ControlHookAttrs<V>,
): ControlHookResult<V> {
  const result = useControlState(attrs);

  return result;
}
