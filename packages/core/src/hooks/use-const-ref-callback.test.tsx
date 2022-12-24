import React, { useState, useEffect, FC } from 'react';
import userEvent from '@testing-library/user-event';
import { render, renderHook } from '@testing-library/react';
import { screen, waitFor } from '@testing-library/dom';

import { DeferredUnlock } from '../../test/deferred-unlock';
import { useConstRefCallback } from './use-const-ref-callback';

describe('useConstRefCallback hook', () => {
  it('should prevent stale closure problem in useEffect env', async () => {
    const globalCachedFnMock = jest.fn();
    const mutex = new DeferredUnlock();

    const CustomAsyncComponent: FC = () => {
      const [time, setTime] = useState(0);
      const safeFn = useConstRefCallback(() => {
        globalCachedFnMock(time);
      });

      useEffect(() => {
        // eslint-disable-next-line no-console
        mutex.promise.then(safeFn).catch(console.error);
      }, []);

      return <button type="button" onClick={() => setTime(10)} />;
    };

    render(<CustomAsyncComponent />);

    await userEvent.click(screen.getByRole('button'));
    mutex.resolve();

    await waitFor(() => {
      expect(globalCachedFnMock).toHaveBeenCalledWith(10);
    });
  });

  it('should always return the same fn reference', () => {
    const { rerender, result } = renderHook(() =>
      useConstRefCallback(() => null),
    );

    const { current: firstRenderFn } = result;

    rerender();
    expect(result.current).toEqual(firstRenderFn);
  });
});
