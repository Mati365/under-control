import { ValidationErrorsArray } from './error';

export type ValidationErrorsListProps<V> = {
  errors: Readonly<ValidationErrorsArray<V>>;
};
