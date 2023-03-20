/* eslint-disable @typescript-eslint/no-floating-promises */
import { useState, FormEvent } from 'react';

import {
  CanBePromise,
  PromiseState,
  usePromiseCallback,
  useUpdateEffect,
  suppressEvent,
} from '@under-control/core';

import {
  ControlHookResult,
  ControlValue,
  UncontrolledControlStateAttrs,
  useControlStrict,
} from '@under-control/inputs';

import {
  FormValidatorHookAttrs,
  FormValidatorHookResult,
  useFormValidator,
} from '@under-control/validate';

import { ValidationException } from '../exceptions';

export type FormValidationMode = 'blur' | 'submit' | 'change';

export type FormHookAttrs<
  V extends ControlValue,
  R = void,
> = UncontrolledControlStateAttrs<V> & {
  validation?: FormValidatorHookAttrs<V> & {
    mode?: FormValidationMode[];
  };

  initialDirty?: boolean;
  resetAfterSubmit?: boolean;
  rethrowSubmitErrors?: boolean;

  onSubmit: (value: V) => CanBePromise<R>;
};

export type FormHookResult<
  V extends ControlValue,
  R = void,
> = ControlHookResult<V> & {
  validator: FormValidatorHookResult<V>;
  submitState: PromiseState<Awaited<R>, any>;
  isDirty: boolean;
  setDirty: (dirty: boolean) => void;
  handleSubmitEvent: (e: FormEvent) => void;
  submit: () => Promise<R>;
};

export function useForm<V extends ControlValue, R = void>({
  validation,
  initialDirty = false,
  resetAfterSubmit = true,
  rethrowSubmitErrors = true,
  onSubmit,
  ...attrs
}: FormHookAttrs<V, R>): FormHookResult<V, R> {
  const supportsValidation = (...modes: FormValidationMode[]): boolean =>
    !!validation?.mode?.some(item => modes.includes(item));

  const [isDirty, setDirty] = useState(initialDirty);

  const validator = useFormValidator<V>(validation ?? {});
  const control = useControlStrict<V>({
    ...attrs,
    onChange: (newValue, prevValue) => {
      attrs.onChange?.(newValue, prevValue);
      setDirty(true);
    },
    onBlur: () => {
      setDirty(true);

      if (supportsValidation('blur')) {
        validator.validate(control.getValue());
      }
    },
  });

  const [handleSubmit, submitState] = usePromiseCallback(
    async () => {
      const value = control.getValue();

      if (supportsValidation('submit', 'blur')) {
        const { errors } = await validator.validate(value);
        if (errors.length) {
          throw new ValidationException(errors);
        }
      } else if (validator.errors.all.length) {
        throw new ValidationException(validator.errors.all);
      }

      const result = await onSubmit(value);

      if (resetAfterSubmit) {
        control.setValue({
          value: attrs.defaultValue,
          merge: false,
        });
      }

      return result;
    },
    { rethrow: rethrowSubmitErrors },
  );

  const handleSubmitEvent = (e: FormEvent): void => {
    suppressEvent(e);
    handleSubmit().catch(error => {
      // eslint-disable-next-line no-console
      console.error(error);
    });
  };

  useUpdateEffect(() => {
    if (!supportsValidation('change')) {
      return;
    }

    validator.validate(control.getValue());
  }, [control.getValue(), validation?.mode?.join(',')]);

  return {
    ...control,
    validator,
    submitState,
    isDirty,
    setDirty,
    handleSubmitEvent,
    submit: handleSubmit,
  };
}
