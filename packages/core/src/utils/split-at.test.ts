import { splitAt } from './split-at';

describe('splitAt', () => {
  it('should split arrays', () => {
    const chunks: [number[], number[]] = splitAt(1, [1, 2, 3]);

    expect(chunks).toEqual([[1], [2, 3]]);
  });

  it('should split strings', () => {
    const chunks: [string, string] = splitAt(2, 'abcdef');

    expect(chunks).toEqual(['ab', 'cdef']);
  });
});
