import { ControllableInputAttrs, ControlledInputAttrs } from '../types';

export function areControlledInputAttrs<V>(
  attrs: ControllableInputAttrs<V>,
): attrs is ControlledInputAttrs<V> {
  return 'value' in attrs && 'onChange' in attrs;
}
