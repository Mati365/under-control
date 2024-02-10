import type { ValidationErrorsArray } from '@under-control/validate';

export class ValidationException extends Error {
  constructor(public readonly validation: ValidationErrorsArray<any>) {
    super('Form validation error exception!');
  }

  static isValidationError(obj: any): obj is ValidationException {
    return obj instanceof ValidationException;
  }
}
