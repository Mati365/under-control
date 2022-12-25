import { safeToArray } from './safe-to-array';

describe('safeToArray', () => {
  it('should transform single item to array', () => {
    expect(safeToArray(2)).toEqual([2]);
  });

  it('should not transform array', () => {
    expect(safeToArray([2, 3])).toEqual([2, 3]);
  });
});
