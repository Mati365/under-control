import { useState } from 'react';

import {
  NonEmptyArray,
  GetAllObjectPaths,
  usePromiseCallback,
  getByPath,
  safeToArray,
} from '@under-control/core';

import { isGlobalValidator } from '../guards';

import { ValidationErrorsArray, Validator } from '../types';
import { FormValidatorsList, useFormValidatorsSelector } from './internal';
import {
  FormValidatorMessagesHookResult,
  useFormValidatorMessages,
} from './use-form-validator-messages';

type FormValidateFn<V> = (
  value: V,
  fields?: NonEmptyArray<GetAllObjectPaths<V>>,
) => Promise<{
  prevErrors: ValidationErrorsArray<V>;
  errors: ValidationErrorsArray<V>;
}>;

export type FormValidatorHookAttrs<V> = {
  validators?: FormValidatorsList<V>;
};

export type FormValidatorHookResult<V> = {
  errors: FormValidatorMessagesHookResult<V>;
  validating: boolean;
  validate: FormValidateFn<V>;
};

export function useFormValidator<V>({
  validators: validatorsGetter,
}: FormValidatorHookAttrs<V>): FormValidatorHookResult<V> {
  const [errors, setErrors] = useState<ValidationErrorsArray<V>>([]);
  const validators = useFormValidatorsSelector(validatorsGetter) ?? [];

  const executeValidator = (value: V) => async (validator: Validator<V>) => {
    // execute root level global validators
    if (isGlobalValidator(validator)) {
      const results = safeToArray(
        await validator({
          value,
        }),
      );

      return results.flatMap(item => {
        if (!item) {
          return [];
        }

        return [
          {
            ...item,
            ...(item.path === undefined && {
              path: null,
            }),
          },
        ];
      });
    }

    // execute nested validators
    const results = await validator.fn({
      value: getByPath<any, any>(validator.path, value),
    });

    return safeToArray(results).flatMap(item => {
      if (!item) {
        return [];
      }

      return [
        {
          ...item,
          ...(item.path === undefined && {
            path: validator.path,
          }),
        },
      ];
    });
  };

  const [validate, { loading: validating }] = usePromiseCallback<
    FormValidateFn<V>
  >(async (value, fields) => {
    // `usePromiseCallback` has guaranteed order of execution so
    // using previous state outside of `setState` is not a big issue
    const prevErrors = errors;

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

    const preservedErrors = fields
      ? prevErrors.filter(error => error.path && !fields.includes(error.path))
      : [];

    // assign validated fields errors, if not fields provided - reset
    const newErrors = [...preservedErrors, ...newFieldsErrors];

    if (newErrors.length || prevErrors.length) {
      setErrors(newErrors);
    }

    return {
      prevErrors,
      errors: newErrors,
    };
  });

  return {
    errors: useFormValidatorMessages({ errors }),
    validate,
    validating,
  };
}
