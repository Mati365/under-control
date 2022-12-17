import { isObjectWithPaths } from './is-object-with-paths';

describe('isObjectWithPaths', () => {
  it.each([
    ['a.b.c', false],
    [[1, 2], true],
    [true, false],
    [0, false],
    [{ a: 2 }, true],
  ])('check if object "%s" contains paths', (obj, expected) => {
    expect(isObjectWithPaths(obj)).toEqual(expected);
  });
});
