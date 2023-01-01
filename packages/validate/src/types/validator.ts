import {
  CanBeArray,
  CanBePromise,
  GetAllObjectPaths,
  GetPathObjectType,
} from '@under-control/core';

import { ValidationError } from './error';

export type ValidatorAttrs<V> = {
  value: V;
};

export type ValidatorResult<V> =
  | CanBePromise<CanBeArray<ValidationError<V>>>
  | CanBePromise<void>;

export type GlobalValidator<V> = (
  attrs: ValidatorAttrs<V>,
) => ValidatorResult<V>;

export type PathValidator<V, P extends GetAllObjectPaths<V>> = {
  path: P;
  fn: (attrs: ValidatorAttrs<GetPathObjectType<V, P>>) => ValidatorResult<V>;
};

export type Validator<V, P extends GetAllObjectPaths<V> = any> =
  | GlobalValidator<V>
  | PathValidator<V, P>;
