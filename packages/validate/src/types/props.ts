import { ValidationErrorsArray } from './error';

export type ValidationErrorsListProps<V> = {
  errors: ValidationErrorsArray<V>;
};
