import { getFlattenPathParts } from './get-flatten-path-parts';

describe('getFlattenPathParts', () => {
  it.each([
    ['a.b.c', ['a', 'b', 'c']],
    ['[0]', [null, 0]],
    ['abc[0][1].d', ['abc', 0, 1, 'd']],
    ['a.0', ['a', '0']],
  ])('should return proper path for %s', (path, expected) => {
    expect(getFlattenPathParts(path)).toEqual(expected);
  });
});
