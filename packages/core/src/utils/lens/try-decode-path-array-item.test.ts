import { tryDecodePathArrayItem } from './try-decode-path-array-item';

describe('tryDecodePathArrayItem', () => {
  it.each(['0', 'test', 'absTest'])(
    'should return null on non array item "%s"',
    part => {
      expect(tryDecodePathArrayItem(part)).toBeNull();
    },
  );

  it('should return single dimension index with field', () => {
    expect(tryDecodePathArrayItem('array[0]')).toEqual({
      field: 'array',
      indices: [0],
    });
  });

  it('should return multi dimension indices with field', () => {
    expect(tryDecodePathArrayItem('array[1][0][3]')).toEqual({
      field: 'array',
      indices: [1, 0, 3],
    });
  });

  it('should return null field if only dimensions provided', () => {
    expect(tryDecodePathArrayItem('[1][0][3]')).toEqual({
      field: null,
      indices: [1, 0, 3],
    });
  });
});
