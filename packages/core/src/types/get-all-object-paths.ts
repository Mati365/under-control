import { JoinWithSeparator } from './join-with-separator';

type ObjectsToIgnore = (new (...parms: any[]) => any) | Date | any[] | Function;

export type ObjectTypeEntry<P, T> = P extends ''
  ? never
  : {
      path: P;
      type: T;
    };

export type GetAllObjectPathsEntries<
  O,
  S extends string = '.',
  P extends string = '',
> =
  | (P extends '' ? never : ObjectTypeEntry<P, O>)
  | (O extends unknown[]
      ? GetAllObjectPathsEntries<
          O[number],
          S,
          JoinWithSeparator<P, `[${number}]`>
        >
      : O extends ObjectsToIgnore
      ? ObjectTypeEntry<P, O>
      : O extends object
      ? {
          [Key in keyof O]: GetAllObjectPathsEntries<
            O[Key],
            S,
            JoinWithSeparator<P, Key>
          >;
        }[keyof O]
      : ObjectTypeEntry<P, O>);

export type GetAllObjectPaths<
  O,
  S extends string = '.',
  P extends string = '',
  D extends ObjectTypeEntry<string, any> = GetAllObjectPathsEntries<O, S, P>,
> = D['path'];

export type GetPathObjectType<
  O,
  P extends GetAllObjectPaths<O>,
  D = GetAllObjectPathsEntries<O>,
> = D extends ObjectTypeEntry<any, any> ? (D & { path: P })['type'] : never;
