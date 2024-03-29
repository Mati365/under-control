/* eslint-disable @typescript-eslint/no-unsafe-argument */
import React, { type FC } from 'react';
import { userEvent } from '@testing-library/user-event';
import {
  renderHook,
  act,
  waitFor,
  render,
  screen,
  fireEvent,
} from '@testing-library/react';

import '@testing-library/jest-dom';
import { controlled } from '@under-control/inputs';

import { DeferredUnlock } from '../../../core/test/deferred-unlock';
import {
  error,
  flattenMessagesList,
  type ValidationErrorsListProps,
} from '@under-control/validate';

import {
  useForm,
  type FormHookAttrs,
  type FormValidationMode,
} from './use-form';

const DEFAULT_HOOK_ATTRS: FormHookAttrs<any> = {
  defaultValue: {},
  onSubmit: () => {},
};

describe('useForm', () => {
  describe('isDirty', () => {
    it('hook starts with false dirty value', () => {
      const { result } = renderHook(() => useForm(DEFAULT_HOOK_ATTRS));

      expect(result.current.isDirty).toBe(false);
    });

    it('uses default dirty boolean for attribute', () => {
      const { result } = renderHook(() =>
        useForm({
          ...DEFAULT_HOOK_ATTRS,
          initialDirty: true,
        }),
      );

      expect(result.current.isDirty).toBe(true);
    });

    it('setValue should set dirty flag to true', async () => {
      const { result } = renderHook(() => useForm(DEFAULT_HOOK_ATTRS));

      act(() => {
        result.current.setValue({
          value: {
            abc: 2,
          },
        });
      });

      expect(result.current.getValue()).toStrictEqual({ abc: 2 });
      expect(result.current.isDirty).toBe(true);
    });

    it('input change should set dirty flag to true', async () => {
      const { result } = renderHook(() => useForm(DEFAULT_HOOK_ATTRS));

      act(() => {
        result.current.bind.entire().onChange({ a: 2 });
      });

      expect(result.current.getValue()).toStrictEqual({ a: 2 });
      expect(result.current.isDirty).toBe(true);
    });
  });

  describe('submit', () => {
    it('calling submit() triggers loading state', async () => {
      const mutex = new DeferredUnlock<number>();
      const onSubmit = jest.fn(async () => mutex.promise);

      const { result } = renderHook(() =>
        useForm({
          defaultValue: 456,
          onSubmit,
        }),
      );

      act(() => {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        result.current.submit();
      });

      expect(onSubmit).toHaveBeenNthCalledWith(1, 456);
      expect(result.current.submitState.loading).toBe(true);

      mutex.resolve(123);

      await waitFor(() => {
        expect(result.current.submitState.loading).toBe(false);
      });
    });

    it('calling submit() triggers loading state', async () => {
      const errorLogSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      const mutex = new DeferredUnlock<number>();
      const exception = new Error('xD!');

      const onSubmit = jest.fn(async () => {
        await mutex.promise;
        throw exception;
      });

      const { result } = renderHook(() =>
        useForm({
          defaultValue: 456,
          onSubmit,
        }),
      );

      act(() => {
        result.current.handleSubmitEvent(new Event('click') as any);
      });

      expect(result.current.submitState.loading).toBe(true);
      mutex.resolve(123);

      await waitFor(() => {
        expect(result.current.submitState.loading).toBe(false);
      });

      expect(errorLogSpy).toBeCalledWith(exception);
      expect(result.current.submitState.error).toMatchObject(exception);
    });

    it('react form handler works', async () => {
      const onSubmit = jest.fn();

      const Component: FC = () => {
        const { bind, handleSubmitEvent, submitState } = useForm({
          rethrowSubmitErrors: false,
          defaultValue: {
            a: '',
            b: '',
          },
          onSubmit,
        });

        return (
          <>
            <form onSubmit={handleSubmitEvent}>
              <input type="text" aria-label="a" {...bind.path('a')} />
              <input type="text" aria-label="b" {...bind.path('b')} />
              <input data-testid="submit" type="submit" value="Submit" />
            </form>

            {submitState.loading && <div>Loading...</div>}
          </>
        );
      };

      render(<Component />);

      const inputs = {
        a: screen.getByRole('textbox', { name: 'a' }),
        b: screen.getByRole('textbox', { name: 'b' }),
      };

      await userEvent.type(inputs.a, 'Test A');
      await userEvent.type(inputs.b, 'Test B');
      fireEvent.submit(screen.getByTestId('submit'));

      await waitFor(() => {
        expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
        expect(onSubmit).toHaveBeenNthCalledWith(1, {
          a: 'Test A',
          b: 'Test B',
        });

        expect(inputs.a).toHaveValue('');
        expect(inputs.b).toHaveValue('');
      });
    });
  });

  describe('validation', () => {
    type FormInputProps = JSX.IntrinsicElements['input'] &
      ValidationErrorsListProps<string>;

    const FormInput = controlled<string, FormInputProps>(
      ({ errors, control, ...props }) => (
        <>
          <input type="text" {...props} {...control.bind.entire()} />
          <div>{flattenMessagesList(errors ?? []).join(',')}</div>
        </>
      ),
    );

    type FormProps = {
      onSubmit: any;
      validationMode: FormValidationMode[];
    };

    const Form: FC<FormProps> = ({ validationMode, onSubmit }) => {
      const {
        bind,
        handleSubmitEvent,
        submitState,
        validator: { errors },
      } = useForm({
        resetAfterSubmit: false,
        rethrowSubmitErrors: false,
        validation: {
          mode: validationMode,
          validators: ({ path }) => [
            path('a', ({ value }) => {
              if (value === 'Hello') {
                return error('Error a');
              }
            }),
            path('b', ({ value }) => {
              if (value === 'World') {
                return error('Error b');
              }
            }),
          ],
        },
        defaultValue: {
          a: '',
          b: '',
        },
        onSubmit,
      });

      return (
        <form onSubmit={handleSubmitEvent}>
          <FormInput
            aria-label="a"
            {...bind.path('a')}
            {...errors.extract('a')}
          />
          <FormInput
            aria-label="b"
            {...bind.path('b')}
            {...errors.extract('b')}
          />

          <input data-testid="submit" type="submit" value="Submit" />

          {submitState.loading && <div>Loading...</div>}
        </form>
      );
    };

    it('should perform on-change validation', async () => {
      const onSubmit = jest.fn();

      render(<Form validationMode={['change']} onSubmit={onSubmit} />);

      const inputs = {
        a: screen.getByRole('textbox', { name: 'a' }),
        b: screen.getByRole('textbox', { name: 'b' }),
      };

      await userEvent.type(inputs.a, 'Hello');
      await userEvent.type(inputs.b, 'World');

      expect(await screen.findByText('Error a')).toBeInTheDocument();
      expect(await screen.findByText('Error b')).toBeInTheDocument();

      // try to submit with errors
      fireEvent.submit(screen.getByTestId('submit'));
      expect(onSubmit).not.toBeCalled();

      // after fixing errors submit should be possible
      await userEvent.type(inputs.a, 'Hello2');
      await userEvent.type(inputs.b, 'World3');

      fireEvent.submit(screen.getByTestId('submit'));

      await waitFor(() => {
        expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
      });

      expect(onSubmit).toBeCalled();

      await waitFor(() => {
        expect(inputs.a).not.toHaveValue('');
        expect(inputs.b).not.toHaveValue('');
      });
    });

    it('should perform on-submit validation', async () => {
      const onSubmit = jest.fn();

      render(<Form validationMode={['submit']} onSubmit={onSubmit} />);

      await userEvent.type(screen.getByRole('textbox', { name: 'a' }), 'Hello');

      // try to submit with errors
      fireEvent.submit(screen.getByTestId('submit'));

      expect(await screen.findByText('Error a')).toBeInTheDocument();
      expect(onSubmit).not.toBeCalled();

      // after fixing errors submit should be possible
      await userEvent.type(
        screen.getByRole('textbox', { name: 'a' }),
        'Hello2',
      );
      fireEvent.submit(screen.getByTestId('submit'));

      await waitFor(() => {
        expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
      });

      expect(onSubmit).toBeCalled();
    });

    it('should perform on-blur validation', async () => {
      const onSubmit = jest.fn();

      render(<Form validationMode={['blur']} onSubmit={onSubmit} />);

      const input = screen.getByRole('textbox', { name: 'a' });

      await userEvent.type(input, 'Hello');
      fireEvent.blur(input);

      expect(await screen.findByText('Error a')).toBeInTheDocument();
    });
  });
});
