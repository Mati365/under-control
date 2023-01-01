import { ValidationError } from '../types';

export const flattenMessagesList = (
  errors: Array<ValidationError<any>>,
): string[] =>
  errors.flatMap(({ messages }) => messages.map(({ message }) => message));
