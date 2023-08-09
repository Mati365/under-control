import React, {
  ComponentType,
  ForwardRefExoticComponent,
  forwardRef,
} from 'react';

import { areControlledControlAttrs } from '../guards';
import { ControlHookResult, useControlStrict } from '../hooks/use-control';
import {
  ControlStateAttrs,
  ControlValue,
  OmitControlStateAttrs,
} from '../types';

export type ControlBindProps<V extends ControlValue> = ControlStateAttrs<V>;

export type ControlInternalProps<V extends ControlValue> = {
  control: ControlHookResult<V>;
};

export function controlled<V extends ControlValue, P = {}>(
  Component: ComponentType<P & ControlInternalProps<V>>,
): ForwardRefExoticComponent<
  OmitControlStateAttrs<P> & ControlBindProps<V> & { ref?: any }
> {
  const Wrapped = forwardRef<
    any,
    OmitControlStateAttrs<P> & ControlBindProps<V>
  >((props, ref) => {
    const control = useControlStrict<V>(props);
    const forwardProps = (() => {
      if (areControlledControlAttrs(props)) {
        const { value, onChange, ...other } = props;
        return other;
      }

      const { defaultValue, ...other } = props;
      return other;
    })();

    return <Component {...(forwardProps as P)} control={control} ref={ref} />;
  });

  Wrapped.displayName = `controlled(${Component.displayName ?? '?'})`;

  return Wrapped as ForwardRefExoticComponent<
    OmitControlStateAttrs<P> & ControlBindProps<V>
  >;
}
