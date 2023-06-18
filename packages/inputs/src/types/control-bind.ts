import { ChangeEvent } from 'react';
import {
  GetAllObjectPaths,
  GetPathObjectType,
  UnionToIntersection,
  ObjectWithPaths,
} from '@under-control/core';

import { ControlValue } from './control-value';

export type ControlBindInputAttrs<V, O = V> = {
  value: V;
  onChange: (value: O | ChangeEvent<HTMLElement>) => void;
  onBlur?: VoidFunction;
};

export type ControlBindPathFn<V extends ControlValue> = <
  K extends GetAllObjectPaths<V>,
  I = GetPathObjectType<V, K>,
  O = GetPathObjectType<V, K>,
>(
  path: K,
  attrs?: {
    noCache?: boolean;
    relatedInputs?: (attrs: {
      controlValue: O;
      newControlValue: O;
      globalValue: V;
      newGlobalValue: V;
    }) => V;
    input?: (value: I) => O;
    output?: (value: O) => I;
  },
) => ControlBindInputAttrs<O>;

export type ControlBindMethods<V, RV = NonNullable<V>> = {
  entire: () => ControlBindInputAttrs<V>;
  merged: () => ControlBindInputAttrs<V, Partial<V>>;
} & (UnionToIntersection<RV> extends ObjectWithPaths
  ? {
      path: ControlBindPathFn<UnionToIntersection<RV>>;
    }
  : {});
