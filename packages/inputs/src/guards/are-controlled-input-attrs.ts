import {
  ControllableInputAttrs,
  ControlledInputAttrs,
  ControlValue,
} from '../types';

export function areControlledInputAttrs<V extends ControlValue>(
  attrs: ControllableInputAttrs<V>,
): attrs is ControlledInputAttrs<V> {
  return 'value' in attrs;
}
