/* eslint-disable @typescript-eslint/ban-types */
/**
 * @example
 *  Transforms type:
 *  {
 *    a: [1, 2, 3]
 *  }
 *  to:
 *  {
 *    a: number[]
 *  }
 */
export type RelaxNarrowType<T> = T extends number
  ? number
  : T extends boolean
    ? boolean
    : T extends Function
      ? T
      : T extends string
        ? string
        : T extends unknown[]
          ? Array<RelaxNarrowType<T[number]>>
          : T extends object
            ? {
                [Key in keyof T]: RelaxNarrowType<T[Key]>;
              }
            : T;
