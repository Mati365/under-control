import { expectTypeOf } from 'expect-type';
import { error } from '../utils';
import { useFormValidatorMessages } from './use-form-validator-messages';

type MockObj = {
  a: {
    b: number;
  };
};

describe('useFormValidatorMessages', () => {
  it('should extract by default element with null path', () => {
    const { extract } = useFormValidatorMessages<MockObj>({
      errors: [error('Error 1'), error('Error 2', null, 'a.b')],
    });

    expectTypeOf(extract).parameter(0).toEqualTypeOf<'a.b' | 'a'>();
    expect(extract('a').errors).toHaveLength(0);
    expect(extract('a.b').errors).toHaveLength(1);
  });

  it('should extract global errors', () => {
    const { global, extract } = useFormValidatorMessages<MockObj>({
      errors: [error('Error 1'), error('Error 2', null, 'a.b')],
    });

    expect(global()).toMatchObject({
      errors: [error('Error 1')],
    });

    expect(extract('a.b', { includeGlobals: true })).toMatchObject({
      errors: [error('Error 1', null, null), error('Error 2', null, null)],
    });
  });

  it('should extract nested paths', () => {
    const { extract } = useFormValidatorMessages<MockObj>({
      errors: [error('Error 1'), error('Error 2', null, 'a.b')],
    });

    expect(extract('a', { nested: true })).toMatchObject({
      errors: [error('Error 2', null, 'b')],
    });
  });
});
