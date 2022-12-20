import React, { ComponentType, FC } from 'react';
import { RelaxNarrowType } from '@under-control/core';

import { ControlHookResult, useControl } from '../hooks/use-control';
import { ControlStateAttrs, ControlValue } from '../types';
import { areControlledControlAttrs } from '../guards';

export type ExposedControlProps<V extends ControlValue, P> = P &
  ControlStateAttrs<RelaxNarrowType<V>>;

export type InternalControlProps<V extends ControlValue, P> = P & {
  control: ControlHookResult<RelaxNarrowType<V>>;
};

export function controlled<
  V extends ControlValue,
  P = {},
  I extends Partial<ExposedControlProps<V, P>> = Partial<
    ExposedControlProps<V, P>
  >,
>(initialProps?: I) {
  return (Component: ComponentType<InternalControlProps<V, P>>) => {
    const Wrapped: FC<ExposedControlProps<V, P & Partial<I>>> = props => {
      const control = useControl<V>(props);
      const forwardProps = (() => {
        if (areControlledControlAttrs(props)) {
          const { value, onChange, ...other } = props;
          return other;
        }

        const { defaultValue, ...other } = props;
        return other;
      })();

      return (
        <Component
          {...initialProps}
          {...(forwardProps as P)}
          control={control}
        />
      );
    };

    Wrapped.displayName = `controlled(${Component.displayName ?? '?'})`;

    return Wrapped;
  };
}
