import { ValidationException } from './validation-error.exception';

describe('ValidationException', () => {
  it('should properly detect validation error', () => {
    expect(
      ValidationException.isValidationError(new ValidationException([])),
    ).toBe(true);

    expect(ValidationException.isValidationError(new Error('abc'))).toBe(false);
  });
});
