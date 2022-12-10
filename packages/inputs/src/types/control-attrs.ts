import { ControlValue } from './control-value';

export type UncontrolledInputAttrs<V extends ControlValue> = {
  defaultValue: V;
};

export type ControlledInputAttrs<V extends ControlValue> = {
  value: V;
  onChange: (newValue: V, prevValue?: V) => void;
};

export type ControllableInputAttrs<V extends ControlValue> =
  | UncontrolledInputAttrs<V>
  | ControlledInputAttrs<V>;
