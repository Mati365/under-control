import React, { FC } from 'react';
import { expectTypeOf } from 'expect-type';
import { render, renderHook, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { ControlledInputAttrs } from '../types';

import { useControlBind } from './use-control-bind';
import { useControlState } from './use-control-state';

describe('useControlBind', () => {
  describe('type inference for value and onChange', () => {
    it('should return string register type', () => {
      const { result } = renderHook(() =>
        useControlBind<string>({
          state: useControlState({
            defaultValue: 'Hello world',
          }),
        }),
      );

      expectTypeOf(result.current).toEqualTypeOf<{
        entire: () => ControlledInputAttrs<string>;
      }>();
    });

    it('should return nested register type for infered defaultValue', () => {
      const defaultValue = {
        a: {
          b: {
            c: [1, 2, 3],
          },
        },
      };

      const { result } = renderHook(() =>
        useControlBind({
          state: useControlState({
            defaultValue,
          }),
        }),
      );

      expectTypeOf(result.current.entire()).toMatchTypeOf<{
        value: {
          a: { b: { c: number[] } };
        };
      }>();

      expectTypeOf(result.current.path('a')).toMatchTypeOf<{
        value: {
          b: { c: number[] };
        };
      }>();

      expectTypeOf(result.current.path('a.b.c')).toMatchTypeOf<{
        value: number[];
        onChange: (value: number[]) => void;
      }>();

      expectTypeOf(result.current.path('a.b.c[0]')).toMatchTypeOf<{
        value: number;
        onChange: (value: number) => void;
      }>();
    });
  });

  describe('component usage', () => {
    it('should sync state with <input /> when use entire bind', async () => {
      const Component: FC = () => {
        const state = useControlState<string>({
          defaultValue: 'Hello world',
        });

        const bind = useControlBind({
          state,
        });

        return (
          <>
            <input name="input" type="text" {...bind.entire()} />
            <div>Value: {state.getValue()}</div>
          </>
        );
      };

      render(<Component />);

      const input = screen.getByRole('textbox');
      expect(input).toHaveValue('Hello world');

      await userEvent.clear(input);
      expect(input).toHaveValue('');

      await userEvent.type(input, 'Abc');
      expect(input).toHaveValue('Abc');
      expect(screen.getByText('Value: Abc')).toBeInTheDocument();
    });

    it('should sync state with <input /> when use path bind', async () => {
      const Component: FC = () => {
        const defaultValue = {
          a: {
            b: 'Hello',
          },
        };

        const state = useControlState({
          defaultValue,
        });

        const bind = useControlBind({
          state,
        });

        return (
          <>
            <input name="input" type="text" {...bind.path('a.b')} />
            <div>Value: {state.getValue().a.b}</div>
          </>
        );
      };

      render(<Component />);

      const input = screen.getByRole('textbox');
      await userEvent.type(input, 'World');

      expect(input).toHaveValue('HelloWorld');
      expect(screen.getByText('Value: HelloWorld')).toBeInTheDocument();
    });
  });

  describe('validation', () => {});
});
