import { error } from '../utils';
import { useFormValidatorMessage } from './use-form-validator-messages';

type MockObj = {
  a: {
    b: number;
  };
};

describe('useFormValidatorMessages', () => {
  it('should extract by default element with null path', () => {
    const { extract } = useFormValidatorMessage<MockObj>({
      errors: [error('Error 1')],
    });

    expect(extract('a')).toHaveLength(0);
    expect(extract()).toMatchObject([error('Error 1', null, null)]);
  });
});
