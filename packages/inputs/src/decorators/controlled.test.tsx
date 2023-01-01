import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { controlled } from './controlled';

describe('controlled', () => {
  it('should render uncontrolled component with default value', () => {
    const Control = controlled<string>(({ control }) => (
      <input type="text" {...control.bind.entire()} />
    ));

    render(<Control defaultValue="Hello world" />);
    expect(screen.getByRole('textbox')).toHaveValue('Hello world');
  });

  it('should render controlled component with value', async () => {
    const mocks = {
      value: 'Hello world',
      onChange: jest.fn(),
    };

    const Control = controlled<string>(({ control }) => (
      <input type="text" {...control.bind.entire()} />
    ));

    render(<Control {...mocks} />);

    const input = screen.getByRole('textbox');

    expect(input).toHaveValue('Hello world');
    await userEvent.clear(input);

    // onChange did not set new state so it should be preserved
    expect(input).toHaveValue('Hello world');
    expect(mocks.onChange).toHaveBeenNthCalledWith(1, '', 'Hello world');
  });
});
