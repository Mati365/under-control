import React, { ComponentType, FC } from 'react';

import { ControlHookResult, useControlStrict } from '../hooks/use-control';
import { ControlStateAttrs, ControlValue } from '../types';
import { areControlledControlAttrs } from '../guards';

export type ControlBindProps<V extends ControlValue> = ControlStateAttrs<V>;

export type ControlInternalProps<V extends ControlValue> = {
  control: ControlHookResult<V>;
};

export function controlled<V extends ControlValue, P = {}>(
  Component: ComponentType<P & ControlInternalProps<V>>,
): ComponentType<P & ControlBindProps<V>> {
  const Wrapped: FC<P & ControlBindProps<V>> = props => {
    const control = useControlStrict<V>(props);
    const forwardProps = (() => {
      if (areControlledControlAttrs(props)) {
        const { value, onChange, ...other } = props;
        return other;
      }

      const { defaultValue, ...other } = props;
      return other;
    })();

    return <Component {...(forwardProps as P)} control={control} />;
  };

  Wrapped.displayName = `controlled(${Component.displayName ?? '?'})`;

  return Wrapped;
}
