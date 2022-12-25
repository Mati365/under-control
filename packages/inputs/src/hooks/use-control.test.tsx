import React, { FC } from 'react';
import { expectTypeOf } from 'expect-type';
import { render, renderHook, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { useControl } from './use-control';
import { ControlBindInputAttrs } from '../types';

describe('useControl', () => {
  describe('type inference for value and onChange', () => {
    it('should return string register type', () => {
      const { result } = renderHook(() =>
        useControl({
          defaultValue: 'Hello world',
        }),
      );

      expectTypeOf(result.current.bind).toEqualTypeOf<{
        entire: () => ControlBindInputAttrs<string>;
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

      const {
        result: {
          current: { bind },
        },
      } = renderHook(() =>
        useControl({
          defaultValue,
        }),
      );

      expectTypeOf(bind.entire()).toMatchTypeOf<{
        value: {
          a: { b: { c: number[] } };
        };
      }>();

      expectTypeOf(bind.path('a')).toMatchTypeOf<{
        value: {
          b: { c: number[] };
        };
      }>();

      expectTypeOf(bind.path('a.b.c')).toMatchTypeOf<{
        value: number[];
        onChange: (value: number[]) => void;
      }>();

      expectTypeOf(bind.path('a.b.c[0]')).toMatchTypeOf<{
        value: number;
        onChange: (value: number) => void;
      }>();
    });
  });

  describe('bind attributes', () => {
    it('map input returns proper value and type', () => {
      const {
        result: {
          current: { bind },
        },
      } = renderHook(() =>
        useControl({
          defaultValue: {
            a: 2,
          },
        }),
      );

      const mappedBind = bind.path('a', { input: val => ({ d: val }) });

      expect(mappedBind.value).toEqual({ d: 2 });
      expectTypeOf(mappedBind).toMatchTypeOf<{
        value: { d: number };
        onChange: (value: { d: number }) => void;
      }>();
    });
  });

  describe('component usage', () => {
    it('should sync state with <input /> when use entire bind', async () => {
      const Component: FC = () => {
        const { getValue, bind } = useControl({
          defaultValue: 'Hello world',
        });

        return (
          <>
            <input name="input" type="text" {...bind.entire()} />
            <div>Value: {getValue()}</div>
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
        const { bind, getValue } = useControl({
          defaultValue: {
            a: {
              b: 'Hello',
            },
          },
        });

        return (
          <>
            <input name="input" type="text" {...bind.path('a.b')} />
            <div>Value: {getValue().a.b}</div>
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

  describe('blur detection', () => {
    it('should detect blur on entire elements', async () => {
      const onBlur = jest.fn();

      const Component: FC = () => {
        const { bind } = useControl({
          defaultValue: '',
          onBlur,
        });

        return (
          <input data-testid="a" name="input" type="text" {...bind.entire()} />
        );
      };

      render(<Component />);

      const input = screen.getByTestId('a');

      await userEvent.type(input, 'ABC');
      await userEvent.click(document.body);

      expect(onBlur).toHaveBeenNthCalledWith(1, {
        path: null,
        value: 'ABC',
      });
    });

    it('should detect blur on path nested elements', async () => {
      const onBlur = jest.fn();

      const Component: FC = () => {
        const { bind } = useControl({
          defaultValue: {
            a: '',
          },
          onBlur,
        });

        return (
          <input data-testid="a" name="input" type="text" {...bind.path('a')} />
        );
      };

      render(<Component />);

      const input = screen.getByTestId('a');

      await userEvent.type(input, 'ABC');
      await userEvent.click(document.body);

      expect(onBlur).toHaveBeenNthCalledWith(1, {
        path: 'a',
        value: 'ABC',
      });
    });
  });
});
