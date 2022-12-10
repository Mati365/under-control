import { useState } from 'react';
import { useConstRefCallback } from '@under-control/core';

import { areControlledInputAttrs } from '../guards';
import { ControllableInputAttrs, ControlValue } from '../types';

type ControlValueSettersAttrs<V extends ControlValue> =
  | { value: V }
  | { value: Partial<V>; merge: true };

type ControlHookState<V extends ControlValue> = {
  value: V;
};

export type ControlStateHookAttrs<V extends ControlValue> =
  ControllableInputAttrs<V>;

export type ControlStateHookResult<V extends ControlValue> = {
  getValue: () => V;
  setValue: (attrs: ControlValueSettersAttrs<V>) => void;
};

export function useControlState<V extends ControlValue>(
  attrs: ControlStateHookAttrs<V>,
): ControlStateHookResult<V> {
  // Check when user provided props such as `value` / `onChange` to check if `defaultValue`
  // should be used. If `controlled` value is true then `initialValue` is copied from `value`.
  // see: https://reactjs.org/docs/uncontrolled-components.html
  const controlled = areControlledInputAttrs(attrs);
  const getInitialState = (): ControlHookState<V> => ({
    value: controlled ? attrs.value : attrs.defaultValue,
  });

  // If `controlled` state is true hook should not persist its own state.
  // State should be synchronized directly with passed prop `value` in that case.
  const [state, setState] = useState<ControlHookState<V>>(getInitialState);

  // Setting value directly to `state` speeds up hook performance.
  // When value is passed this way: `Parent A -> Child B -> Child C`
  // it prevents `Child B` or `Child C` to be rerendered twice (or more) times
  if (controlled) {
    state.value = attrs.value;
  }

  // Accessors with constant ref and always newest scope inside functions bodies
  // `getStateValue()` call will return always newest value even if you call it in useMemo(() => {}, [])
  const getInternalStateValue = useConstRefCallback(() => state.value);
  const setInternalStateValue = useConstRefCallback(
    ({ value, rerender = true }: { value: V; rerender?: boolean }) => {
      if (rerender) {
        setState(prevState => ({
          ...prevState,
          value,
        }));
      } else {
        state.value = value;
      }
    },
  );

  // Method that sets value to its internal state and tries to detect if hook value is controlled.
  // If hook is controlled - skips state update and passes value directly to parent using onChange.
  // Otherwise it updates the state and behaves as standalone uncontrolled control.
  const setValueOrFireChange = useConstRefCallback(
    (changedAttrs: ControlValueSettersAttrs<V>) => {
      const currentValue = getInternalStateValue();
      const newValue = (() => {
        if ('merge' in changedAttrs) {
          if (typeof currentValue !== 'object') {
            throw new Error(
              'You passed `merge: true` when hook `state` is not object!',
            );
          }

          return { ...currentValue, ...changedAttrs.value };
        }

        return changedAttrs.value;
      })();

      setInternalStateValue({
        value: newValue,
        rerender: !controlled,
      });

      if (controlled) {
        attrs.onChange(newValue, currentValue);
      }
    },
  );

  return {
    getValue: getInternalStateValue,
    setValue: setValueOrFireChange,
  };
}
