import {
  ControllableInputAttrs,
  UncontrolledInputAttrs,
  ControlValue,
} from '../types';

export function areUncontrolledInputAttrs<V extends ControlValue>(
  attrs: ControllableInputAttrs<V>,
): attrs is UncontrolledInputAttrs<V> {
  return 'defaultValue' in attrs;
}
