import { setByPath } from './set-by-path';

describe('setByPath', () => {
  describe('existing fields', () => {
    it('should set first level prop number value for object', () => {
      const result = setByPath('a', 3, { a: 2 });

      expect(result).toEqual({
        a: 3,
      });
    });

    it('should set first level object value', () => {
      const result = setByPath('a', { b: 5 }, { a: { b: 4 } });

      expect(result).toEqual({
        a: { b: 5 },
      });
    });

    it('should set array first level value', () => {
      const result = setByPath('[1]', 1, [4, 5, 2]);

      expect(result).toEqual([4, 1, 2]);
    });

    it('should set nested existing object value', () => {
      const result = setByPath('a.b', 6, { a: { b: 4 } });

      expect(result).toEqual({
        a: { b: 6 },
      });
    });

    it('should set nested existing array value', () => {
      const result = setByPath('a.b[1]', 6, { a: { b: [4, 5, 6] } });

      expect(result).toEqual({
        a: { b: [4, 6, 6] },
      });
    });
  });

  describe('non existing fields', () => {
    it('should create first level prop if not exists', () => {
      const obj: { a: number; b?: number } = { a: 2 };
      const result = setByPath('b', 3, obj);

      expect(result).toEqual({ a: 2, b: 3 });
    });

    it('should create second level object prop if not exists', () => {
      const obj: { a: { c: number; b?: number } } = { a: { c: 3 } };
      const result = setByPath('a.b', 4, obj);

      expect(result).toEqual({ a: { c: 3, b: 4 } });
    });

    it('should create third level object prop if not exists', () => {
      const obj: { a?: { b?: { c?: number } } } = {};
      const result = setByPath('a.b.c', 4, obj);

      expect(result).toEqual({ a: { b: { c: 4 } } });
    });

    it('should create third level array prop if not exists', () => {
      const obj: { a?: { b?: number[] } } = {};
      const result = setByPath('a.b[1]', 4, obj);

      expect(result).toEqual({ a: { b: [undefined, 4] } });
    });
  });
});
