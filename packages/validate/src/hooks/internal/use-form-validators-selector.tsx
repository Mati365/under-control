import {
  identity,
  type NonEmptyArray,
  type GetAllObjectPaths,
  type Reader,
} from '@under-control/core';

import type { PathValidator, GlobalValidator, Validator } from '../../types';

export type FormValidators<V> = NonEmptyArray<Validator<V>>;

export type FormValidatorUtils<V> = {
  path: <P extends GetAllObjectPaths<V>>(
    path: P,
    fn: PathValidator<V, P>['fn'],
  ) => PathValidator<V, P>;

  global: (fn: GlobalValidator<V>) => GlobalValidator<V>;
};

export type FormValidatorsList<V> =
  | FormValidators<V>
  | Reader<FormValidatorUtils<V>, FormValidators<V> | Validator<V>>
  | undefined;

export function useFormValidatorsSelector<V>(
  validatorsGetter: FormValidatorsList<V>,
): FormValidators<V> | undefined {
  if (typeof validatorsGetter === 'function') {
    const result = validatorsGetter({
      global: identity,
      path: (path, fn) => ({
        path,
        fn,
      }),
    });

    return Array.isArray(result) ? result : [result];
  }

  return validatorsGetter;
}
