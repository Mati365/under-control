import { JoinWithSeparator } from './join-with-separator';

type MaxPathDepthGuard<N extends number> = [1, 2, 3, 4, 5, 6, 7, never][N];

type MappingTypePathExtractor<
  K,
  P,
  S extends string,
  D extends number,
> = D extends never
  ? unknown
  : P extends {}
  ? JoinWithSeparator<K, GetAllObjectPaths<P, S, D>, S>
  : K;

export type GetAllObjectPaths<
  T,
  S extends string = '.',
  D extends number = 0,
> = D extends never
  ? unknown
  : T extends object
  ? {
      [K in keyof T]: MappingTypePathExtractor<
        K,
        T[K],
        S,
        MaxPathDepthGuard<D>
      >;
    }[keyof T]
  : '';
