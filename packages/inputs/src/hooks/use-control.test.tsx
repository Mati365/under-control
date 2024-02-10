import React, { type FC } from 'react';

import { expectTypeOf } from 'expect-type';
import { userEvent } from '@testing-library/user-event';
import { render, renderHook, screen, act } from '@testing-library/react';

import { useControl } from './use-control';
import { controlled } from '../decorators/controlled';
import type { ControlBindInputAttrs } from '../types';

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
        merged: () => ControlBindInputAttrs<string, Partial<string>>;
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

    it('map relations returns proper value and type', async () => {
      const { result } = renderHook(() =>
        useControl({
          defaultValue: {
            a: 2,
            b: 3,
          },
        }),
      );

      const mappedBind = result.current.bind.path('a', {
        relatedInputs: ({ newControlValue, newGlobalValue }) => ({
          ...newGlobalValue,
          b: newControlValue * 2,
        }),
      });

      expect(mappedBind.value).toEqual(2);
      expectTypeOf(mappedBind).toMatchTypeOf<{
        value: number;
        onChange: (value: number) => void;
      }>();

      act(() => {
        mappedBind.onChange(4);
      });

      expect(result.current.getValue()).toMatchObject({
        a: 4,
        b: 8,
      });
    });
  });

  describe('component usage', () => {
    it('infer properly input type', async () => {
      const ComponentA = controlled<string>(({ control }) => (
        <input name="input" type="text" {...control.bind.entire()} />
      ));

      const ComponentB: FC = () => {
        const { bind } = useControl({
          defaultValue: {
            a: {
              content: 'Hello world',
            },
          },
        });

        return (
          <ComponentA
            {...bind.path('a', {
              input: val => val.content,
              output: val => ({ content: val }),
            })}
          />
        );
      };

      render(<ComponentB />);

      const input = screen.getByRole('textbox');
      expect(input).toHaveValue('Hello world');
    });

    it('should sync merged state with <input /> when use entire bind', async () => {
      const ComponentA = controlled<{ a: string }>(({ control }) => (
        <input name="input" type="text" {...control.bind.path('a')} />
      ));

      const ComponentB: FC = () => {
        const { getValue, bind } = useControl({
          defaultValue: {
            a: 'Hello world',
            b: 'survived',
          },
        });

        return (
          <>
            <ComponentA {...bind.merged()} />
            <div>Value: {getValue().b}</div>
          </>
        );
      };

      render(<ComponentB />);

      const input = screen.getByRole('textbox');
      expect(input).toHaveValue('Hello world');

      await userEvent.clear(input);
      expect(input).toHaveValue('');

      await userEvent.type(input, 'Abc');
      expect(input).toHaveValue('Abc');
      expect(screen.getByText('Value: survived')).toBeInTheDocument();
    });

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

    it('should detect blur in merged component', async () => {
      const onBlurMock = jest.fn();

      const ComponentA = controlled<{ a: string }, { onBlur?: any }>(
        ({ control, onBlur }) => (
          <input
            name="input"
            type="text"
            {...control.bind.path('a')}
            onBlur={onBlur}
          />
        ),
      );

      const ComponentB: FC = () => {
        const { getValue, bind } = useControl({
          defaultValue: {
            a: 'Hello world',
            b: 'survived',
          },
          onBlur: onBlurMock,
        });

        return (
          <>
            <ComponentA {...bind.merged()} />
            <div>Value: {getValue().b}</div>
          </>
        );
      };

      render(<ComponentB />);

      const input = await screen.findByRole('textbox');

      await userEvent.type(input, 'ABC');
      await userEvent.click(document.body);

      expect(onBlurMock).toHaveBeenNthCalledWith(1, {
        path: null,
        value: {
          a: 'Hello worldABC',
          b: 'survived',
        },
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

  describe('bind cache', () => {
    it('has onChange cache for bind global', async () => {
      const { result } = renderHook(() =>
        useControl({
          defaultValue: 'Hello world',
        }),
      );

      const cached = result.current.bind.entire();
      act(() => {
        cached.onChange('Ala ma kota');
      });

      const newResult = result.current.bind.entire();
      expect(newResult.onChange).toEqual(cached.onChange);
      expect(newResult.value).toEqual('Ala ma kota');
    });

    it('has onChange cache for bind path', async () => {
      const { result } = renderHook(() =>
        useControl({
          defaultValue: {
            a: 'A',
            b: 'B',
          },
        }),
      );

      const bindPaths = [
        ['a', 'Ala ma kota'],
        ['b', 'A kot ma ale'],
      ] as const;

      const bindCache: any[] = [];

      act(() => {
        for (const [path, value] of bindPaths) {
          const boundResult = result.current.bind.path(path);

          bindCache.push(boundResult);
          boundResult.onChange(value);
        }
      });

      bindPaths.forEach(([path, value], index) => {
        const newResult = result.current.bind.path(path);

        expect(newResult.onChange).toEqual(bindCache[index].onChange);
        expect(newResult.value).toEqual(value);
      });
    });

    it('skips cache if noCache = true', async () => {
      const { result } = renderHook(() =>
        useControl({
          defaultValue: {
            a: 'Hello world',
          },
        }),
      );

      const cached = result.current.bind.path('a', { noCache: true });
      act(() => {
        cached.onChange('Ala ma kota');
      });

      const newResult = result.current.bind.path('a', { noCache: true });
      expect(newResult.onChange).not.toEqual(cached.onChange);
      expect(newResult.value).toEqual('Ala ma kota');
    });
  });
});
