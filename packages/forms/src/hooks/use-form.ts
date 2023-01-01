/* eslint-disable @typescript-eslint/no-floating-promises */
import { useState, FormEvent } from 'react';

import {
  Either,
  RelaxNarrowType,
  CanBePromise,
  usePromiseCallback,
  useUpdateEffect,
  suppressEvent,
  left,
  right,
} from '@under-control/core';

import {
  ControlHookResult,
  ControlValue,
  UncontrolledControlStateAttrs,
  useControl,
} from '@under-control/inputs';

import {
  FormValidatorHookAttrs,
  FormValidatorHookResult,
  useFormValidator,
  ValidationError,
} from '@under-control/validate';

export type FormValidationMode = 'blur' | 'submit' | 'change';

export type FormHookAttrs<
  V extends ControlValue,
  R = void,
> = UncontrolledControlStateAttrs<V> & {
  validation?: FormValidatorHookAttrs<V> & {
    mode?: FormValidationMode[];
  };

  initialDirty?: boolean;
  onSubmit: (value: V) => CanBePromise<R>;
};

export type FormHookResult<
  V extends ControlValue,
  R = void,
> = ControlHookResult<V> & {
  validator: FormValidatorHookResult<V>;
  submitState: {
    loading: boolean;
    error?: any;
  };
  isDirty: boolean;
  setDirty: (dirty: boolean) => void;
  handleSubmitEvent: (e: FormEvent) => void;
  submit: () => Promise<Either<Array<ValidationError<V, any, any>>, R>>;
};

export function useForm<V extends ControlValue, R = void>({
  validation,
  initialDirty = false,
  onSubmit,
  ...attrs
}: FormHookAttrs<RelaxNarrowType<V>, R>): FormHookResult<
  RelaxNarrowType<V>,
  R
> {
  const supportsValidation = (...modes: FormValidationMode[]): boolean =>
    !!validation?.mode?.some(item => modes.includes(item));

  const [isDirty, setDirty] = useState(initialDirty);

  const validator = useFormValidator<RelaxNarrowType<V>>(validation ?? {});
  const control = useControl<V>({
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

  const [handleSubmit, submitState] = usePromiseCallback(async () => {
    const value = control.getValue();

    if (supportsValidation('submit', 'blur')) {
      const { errors } = await validator.validate(value);
      if (errors.length) {
        return left(errors);
      }
    } else if (validator.errors.all.length) {
      return left(validator.errors.all);
    }

    return right(await onSubmit(value));
  });

  const handleSubmitEvent = (e: FormEvent): void => {
    suppressEvent(e);
    handleSubmit();
  };

  useUpdateEffect(() => {
    if (!supportsValidation('change')) {
      return;
    }

    validator.validate(control.getValue());
  }, [control.getValue(), validation?.mode]);

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
