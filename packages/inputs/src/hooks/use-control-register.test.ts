import { useControlRegister } from './use-control-register';
import { useControlState } from './use-control-state';

describe('useControlBind', () => {
  it('should call proper setState methods on string input changes', () => {
    const state = useControlState<string>({
      defaultValue: 'Hello world',
    });

    const { register } = useControlRegister({
      state,
    });

    register();
    // todo: add type tests
  });

  it('should call proper setState methods on object input changes', () => {
    const state = useControlState({
      defaultValue: {
        a: {
          b: {
            c: [3, 4],
          },
        },
      },
    });

    const { register } = useControlRegister({
      state,
    });

    register('a.b.c[2]');
    // todo: add type tests
  });
});
