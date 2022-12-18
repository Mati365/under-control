import { useForm } from './use-form';

describe('useForm', () => {
  test('Workaround', () => {
    const r = useForm();

    expect(r).toBeUndefined();
  });
});
