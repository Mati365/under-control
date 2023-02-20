import React, { FC } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { pickEventValue } from './pick-event-value';

describe('pickEventValue', () => {
  it.each([1, 'abc', { a: 2 }, [1, 2], true, false])(
    'should not process event "%s" value',
    value => {
      expect(pickEventValue(value)).toEqual(value);
    },
  );

  it('should pick correct value from checkboxes', async () => {
    const trackFn = jest.fn();
    const Component: FC = () => (
      <input type="checkbox" onChange={e => trackFn(pickEventValue(e))} />
    );

    render(<Component />);
    await userEvent.click(screen.getByRole('checkbox'));

    expect(trackFn).toBeCalledWith(true);
  });

  it('should pick first file from file input', async () => {
    const callback = jest.fn();
    const testFile = new File(['hello'], 'hello.png', {
      type: 'image/png',
    });

    render(
      <input
        data-testid="file"
        type="file"
        onChange={e => callback(pickEventValue(e))}
      />,
    );

    await userEvent.upload(screen.getByTestId('file'), testFile);
    expect(callback).toBeCalledWith(testFile);
  });
});
