import { useState } from 'react';

import {
  NonEmptyArray,
  GetAllObjectPaths,
  usePromiseCallback,
  getByPath,
  safeToArray,
} from '@under-control/core';

import { isGlobalValidator } from '../guards';

import { ValidationError, Validator } from '../types';
import { FormValidatorsList, useFormValidatorsSelector } from './internal';

type FormValidateFn<V> = (
  value: V,
  fields?: NonEmptyArray<GetAllObjectPaths<V>>,
) => Promise<void>;

export type FormValidatorHookAttrs<V> = {
  validators: FormValidatorsList<V>;
};

export type FormValidatorHookResult<V> = {
  errors: Array<ValidationError<V, any>>;
  validating: boolean;
  validate: FormValidateFn<V>;
};

export function useFormValidator<V>({
  validators: validatorsGetter,
}: FormValidatorHookAttrs<V>): FormValidatorHookResult<V> {
  const [errors, setErrors] = useState<Array<ValidationError<V, any>>>([]);
  const validators = useFormValidatorsSelector(validatorsGetter);

  const executeValidator = (value: V) => async (validator: Validator<V>) => {
    // execute root level global validators
    if (isGlobalValidator(validator)) {
      const results = safeToArray(
        await validator({
          value,
        }),
      );

      return results.map(item => ({
        ...item,
        ...(item.path === undefined && {
          path: null,
        }),
      }));
    }

    // execute nested validators
    const results = await validator.fn({
      value: getByPath<any, any>(validator.path, value),
    });

    return safeToArray(results).map(item => ({
      ...item,
      ...(item.path === undefined && {
        path: validator.path,
      }),
    }));
  };

  const [validate, { loading: validating }] = usePromiseCallback<
    FormValidateFn<V>
  >(async (value, fields) => {
    // pick only specified in validate() call fields validators
    const filteredValidators = fields
      ? validators.filter(
          validator =>
            isGlobalValidator(validator) || fields.includes(validator.path),
        )
      : validators;

    // execute all validators in parallel
    const newFieldsErrors = (
      await Promise.all(filteredValidators.map(executeValidator(value)))
    ).flat();

    // assign validated fields errors, if not fields provided - reset
    setErrors(oldErrors => {
      const preservedErrors = fields
        ? oldErrors.filter(error => error.path && !fields.includes(error.path))
        : [];

      return [...preservedErrors, ...newFieldsErrors];
    });
  });

  return {
    errors,
    validate,
    validating,
  };
}
