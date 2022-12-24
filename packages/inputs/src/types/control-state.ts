export type ControlChangeValueCallback<V> = (newValue: V, prevValue: V) => void;

export type UncontrolledControlStateAttrs<V> = {
  defaultValue: V;
  onChange?: ControlChangeValueCallback<V>;
};

export type ControlledControlStateAttrs<V> = {
  value: V;
  onChange: ControlChangeValueCallback<V>;
};

export type ControlStateAttrs<V> =
  | UncontrolledControlStateAttrs<V>
  | ControlledControlStateAttrs<V>;
