import { GlobalValidator, Validator } from '../types';

export function isGlobalValidator<V>(
  validator: Validator<V, any>,
): validator is GlobalValidator<V> {
  return typeof validator === 'function';
}
