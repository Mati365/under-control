export type UncontrolledInputAttrs<V> = {
  defaultValue: V;
};

export type ControlledInputAttrs<V> = {
  value: V;
  onChange: (newValue: V, prevValue?: V) => void;
};

export type ControllableInputAttrs<V> =
  | UncontrolledInputAttrs<V>
  | ControlledInputAttrs<V>;
