import { renderHook, act } from '@testing-library/react';
import { useControlState } from './use-control-state';

describe('useControlState', () => {
  describe('setValue', () => {
    it('should trigger onChange when call .setValue', () => {
      const onChange = jest.fn();

      const { result } = renderHook(() =>
        useControlState<string>({
          value: 'Hello',
          onChange,
        }),
      );

      result.current.setValue({ value: 'World' });
      expect(result.current.getValue()).toBe('World');
      expect(onChange).toHaveBeenNthCalledWith(1, 'World');
    });

    it('should raise exception when call setValue(merge: true) for non-object type', () => {
      const { result } = renderHook(() =>
        useControlState<string>({
          defaultValue: 'Hello',
        }),
      );

      expect(() => {
        result.current.setValue({
          value: 'O',
          merge: true,
        });
      }).toThrowError(/merge: true/);
    });

    it('should merge values', async () => {
      type InitialState = {
        a: number;
        b: number;
        d?: number;
      };

      const { result } = renderHook(() =>
        useControlState<InitialState>({
          defaultValue: {
            a: 2,
            b: 3,
          },
        }),
      );

      await act(() => {
        result.current.setValue({
          value: {
            d: 4,
          },
          merge: true,
        });
      });

      expect(result.current.getValue()).toStrictEqual({
        a: 2,
        b: 3,
        d: 4,
      });
    });
  });
});
