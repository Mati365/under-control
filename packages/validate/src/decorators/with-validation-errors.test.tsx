import React from 'react';
import { render, screen } from '@testing-library/react';

import { withValidationErrors } from './with-validation-errors';
import { error, flattenMessagesList } from '../utils';

describe('withValidationErrors', () => {
  it('should not crash if errors list is not provided', () => {
    const TestComponent = withValidationErrors<number>(() => (
      <div>Success</div>
    ));

    render(<TestComponent />);
  });

  it('should forward errors for primitive types in test component', async () => {
    const TestComponent = withValidationErrors<number>(({ errors }) => (
      <div>{flattenMessagesList(errors.extract()).join(',')}</div>
    ));

    render(<TestComponent errors={[error('Błąd')]} />);
    expect(screen.getByText('Błąd')).toBeInTheDocument();
  });
});
