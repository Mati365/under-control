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
};

export type ControlBindPathAttrs<V, O = V> = {
  input?: (value: V) => O;
  output?: (value: O) => V;
};

export type ControlBindPathFn<V extends ControlValue> = <
  K extends GetAllObjectPaths<V>,
  O extends ControlBindPathAttrs<
    GetPathObjectType<V, K>,
    any
  > = ControlBindPathAttrs<GetPathObjectType<V, K>>,
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
