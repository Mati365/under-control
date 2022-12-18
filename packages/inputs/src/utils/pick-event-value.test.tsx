import React, { FC } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { pickEventValue } from './pick-event-value';

describe('pickEventValue', () => {
  it.each([1, 'abc', { a: 2 }, [1, 2]])(
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
});
