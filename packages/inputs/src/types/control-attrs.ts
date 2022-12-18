import { ChangeEvent } from 'react';

export type UncontrolledInputAttrs<V> = {
  defaultValue: V;
};

export type ControlledInputAttrs<V> = {
  value: V;
  onChange: (newValue: V | ChangeEvent<HTMLElement>) => void;
};

export type ControllableInputAttrs<V> =
  | UncontrolledInputAttrs<V>
  | ControlledInputAttrs<V>;
