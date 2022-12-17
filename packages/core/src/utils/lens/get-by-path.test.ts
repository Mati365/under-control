import { getByPath } from './get-by-path';

describe('getByPath', () => {
  it('should get first level prop from object', () => {
    expect(getByPath('a', { a: 2 })).toEqual(2);
  });

  it('should get nested level prop from object', () => {
    expect(getByPath('a.b', { a: { b: [2] } })).toEqual([2]);
  });

  it('should get first level array item by index', () => {
    expect(getByPath('[1]', [1, 4])).toEqual(4);
  });

  it('should get nested level array item by index', () => {
    expect(getByPath('a.b[0][1]', { a: { b: [[1, 3]] } })).toEqual(3);
  });

  it('should return undefined for non existing keys', () => {
    const obj: { a?: { b?: number[][] } } = {};

    expect(getByPath('a.b[0][1]', obj)).toBeUndefined();
  });
});
