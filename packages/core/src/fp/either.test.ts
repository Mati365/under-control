import { left, right, match } from './either';

describe('Either', () => {
  it('should match left either', () => {
    const onLeft = jest.fn();
    const onRight = jest.fn();

    match(left(3), onLeft, onRight);

    expect(onLeft).toBeCalledWith(3);
    expect(onRight).not.toBeCalled();
  });

  it('should match right either', () => {
    const onLeft = jest.fn();
    const onRight = jest.fn();

    match(right(4), onLeft, onRight);

    expect(onLeft).not.toBeCalled();
    expect(onRight).toBeCalledWith(4);
  });
});
