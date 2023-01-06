import { ChangeEvent } from 'react';
import {
  GetAllObjectPaths,
  GetPathObjectType,
  ObjectWithPaths,
} from '@under-control/core';

import { ControlValue } from './control-value';

export type ControlBindInputAttrs<V> = {
  value: V;
  onChange: (value: V | ChangeEvent<HTMLElement>) => void;
  onBlur?: VoidFunction;
};

export type ControlBindPathAttrs<G, V, O = V> = {
  noCache?: boolean;
  relatedInputs?: (attrs: {
    controlValue: O;
    newControlValue: O;
    globalValue: G;
    newGlobalValue: G;
  }) => G;

  input?: (value: V) => O;
  output?: (value: O) => V;
};

export type ControlBindPathFn<V extends ControlValue> = <
  K extends GetAllObjectPaths<V>,
  O extends ControlBindPathAttrs<
    V,
    GetPathObjectType<V, K>,
    any
  > = ControlBindPathAttrs<V, GetPathObjectType<V, K>>,
>(
  path: K,
  attrs?: O,
) => ControlBindInputAttrs<ReturnType<Exclude<O['input'], undefined>>>;

export type ControlBindMethods<V> = {
  entire: () => ControlBindInputAttrs<V>;
} & (V extends ObjectWithPaths
  ? {
      path: ControlBindPathFn<V>;
    }
  : {});
