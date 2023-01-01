import {
  NonEmptyArray,
  GetAllObjectPaths,
  Reader,
  identity,
} from '@under-control/core';

import { PathValidator, GlobalValidator, Validator } from '../../types';

export type FormValidators<V> = NonEmptyArray<Validator<V>>;

export type FormValidatorUtils<V> = {
  path: <P extends GetAllObjectPaths<V>>(
    path: P,
    fn: PathValidator<V, P>['fn'],
  ) => PathValidator<V, P>;

  all: (fn: GlobalValidator<V>) => GlobalValidator<V>;
};

export type FormValidatorsList<V> =
  | FormValidators<V>
  | Reader<FormValidatorUtils<V>, FormValidators<V> | Validator<V>>;

export function useFormValidatorsSelector<V>(
  validatorsGetter: FormValidatorsList<V>,
): FormValidators<V> {
  if (typeof validatorsGetter === 'function') {
    const result = validatorsGetter({
      all: identity,
      path: (path, fn) => ({
        path,
        fn,
      }),
    });

    return Array.isArray(result) ? result : [result];
  }

  return validatorsGetter;
}
