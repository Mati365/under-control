import React, { ComponentType, FC } from 'react';
import {
  FormValidatorMessagesHookAttrs,
  FormValidatorMessagesHookResult,
  useFormValidatorMessages,
} from '../hooks/use-form-validator-messages';

export type ExposedValidationErrorsProps<V, P> = P & {
  errors?: FormValidatorMessagesHookAttrs<V>['errors'];
};

export type InternalValidationErrorsProps<V, P> = P & {
  errors: FormValidatorMessagesHookResult<V>;
};

export function withValidationErrors<V, P = {}>(
  Component: ComponentType<InternalValidationErrorsProps<V, P>>,
): ComponentType<ExposedValidationErrorsProps<V, P>> {
  const Wrapped: FC<ExposedValidationErrorsProps<V, P>> = ({
    errors,
    ...props
  }) => {
    const result = useFormValidatorMessages({
      errors: errors ?? [],
    });

    return <Component {...(props as unknown as P)} errors={result} />;
  };

  Wrapped.displayName = `withValidationErrors(${Component.displayName ?? '?'})`;

  return Wrapped;
}
