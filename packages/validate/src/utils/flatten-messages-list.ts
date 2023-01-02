import { ValidationErrorsArray } from '../types';

export const flattenMessagesList = (
  errors: Readonly<ValidationErrorsArray<any>>,
): string[] =>
  errors.flatMap(({ messages }) => messages.map(({ message }) => message));
