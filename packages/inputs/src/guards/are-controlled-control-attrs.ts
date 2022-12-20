import { ControlStateAttrs, ControlledControlStateAttrs } from '../types';

export function areControlledControlAttrs<V>(
  attrs: ControlStateAttrs<V>,
): attrs is ControlledControlStateAttrs<V> {
  return 'value' in attrs && 'onChange' in attrs;
}
