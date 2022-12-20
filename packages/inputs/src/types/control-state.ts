export type UncontrolledControlStateAttrs<V> = {
  defaultValue: V;
};

export type ControlledControlStateAttrs<V> = {
  value: V;
  onChange: (newValue: V, prevValue: V) => void;
};

export type ControlStateAttrs<V> =
  | UncontrolledControlStateAttrs<V>
  | ControlledControlStateAttrs<V>;
