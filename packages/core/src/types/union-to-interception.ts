import type { ObjectWithoutPaths } from './get-all-object-paths';

type UnionToIntersectionInternal<U> = (
  U extends any ? (k: U) => void : never
) extends (k: infer I) => void
  ? I
  : never;

export type UnionToIntersection<U> = U extends ObjectWithoutPaths
  ? U
  : UnionToIntersectionInternal<U> extends infer O
    ? { [K in keyof O]: O[K] }
    : never;
