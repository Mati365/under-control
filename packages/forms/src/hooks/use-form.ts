import { useState, FormEvent } from 'react';

import {
  RelaxNarrowType,
  CanBePromise,
  usePromiseCallback,
  suppressEvent,
} from '@under-control/core';

import {
  ControlHookResult,
  ControlValue,
  UncontrolledControlStateAttrs,
  useControl,
} from '@under-control/inputs';

export type FormSubmitCallback<V extends ControlValue> = (
  data: RelaxNarrowType<V>,
) => CanBePromise<void>;

export type FormHookAttrs<
  V extends ControlValue,
  R = void,
> = UncontrolledControlStateAttrs<V> & {
  initialDirty?: boolean;
  onSubmit: (value: V) => CanBePromise<R>;
};

export type FormHookResult<
  V extends ControlValue,
  R = void,
> = ControlHookResult<V> & {
  error: any;
  submitting: boolean;
  isDirty: boolean;
  setDirty: (dirty: boolean) => void;
  handleSubmitEvent: (e: FormEvent) => void;
  submit: () => Promise<R>;
};

export function useForm<V extends ControlValue, R = void>({
  initialDirty = false,
  onSubmit,
  ...attrs
}: FormHookAttrs<RelaxNarrowType<V>, R>): FormHookResult<
  RelaxNarrowType<V>,
  R
> {
  const [isDirty, setDirty] = useState(initialDirty);
  const control = useControl<V>({
    ...attrs,
    onChange: (newValue, prevValue) => {
      attrs.onChange?.(newValue, prevValue);
      setDirty(true);
    },
  });

  const [handleSubmit, { error, loading }] = usePromiseCallback(async () =>
    onSubmit(control.getValue()),
  );

  const handleSubmitEvent = (e: FormEvent): void => {
    suppressEvent(e);

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    handleSubmit();
  };

  return {
    ...control,
    submitting: !!loading,
    error,
    isDirty,
    setDirty,
    handleSubmitEvent,
    submit: handleSubmit,
  };
}
