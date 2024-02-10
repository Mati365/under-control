import type { Validator } from '../types';
import { isGlobalValidator } from './is-global-validator';

describe('isGlobalValidator', () => {
  it('should detect global validator', () => {
    const validator: Validator<any> = () => [];

    expect(isGlobalValidator(validator)).toBe(true);
  });

  it('should detect path validator', () => {
    const validator: Validator<{ a: 2 }> = {
      path: 'a',
      fn: () => [],
    };

    expect(isGlobalValidator(validator)).toBe(false);
  });
});
