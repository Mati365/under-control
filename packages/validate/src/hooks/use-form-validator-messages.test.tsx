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

    expectTypeOf(extract)
      .parameter(0)
      .toEqualTypeOf<'a.b' | 'a' | null | undefined>();

    expect(extract('a')).toHaveLength(1);
    expect(extract()).toMatchObject([
      error('Error 1', null, null),
      error('Error 2', null, 'a.b'),
    ]);
  });
});
