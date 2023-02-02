import { JoinWithSeparator } from './join-with-separator';

export type ObjectWithoutPaths =
  | (new (...parms: any[]) => any)
  | Date
  | any[]
  | Function
  | number
  | boolean
  | string;

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
> = unknown extends O
  ? {
      path: string;
      type: any;
    }
  :
      | (P extends '' ? never : ObjectTypeEntry<P, O>)
      | (O extends unknown[]
          ? GetAllObjectPathsEntries<O[number], S, `${P}[${number}]`>
          : O extends ObjectWithoutPaths
          ? ObjectTypeEntry<P, O>
          : O extends object
          ? {
              [Key in keyof Required<O>]: GetAllObjectPathsEntries<
                O[Key],
                S,
                JoinWithSeparator<P, Key>
              >;
            }[keyof Required<O>]
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
  D extends { type: any } = GetAllObjectPathsEntries<O>,
> = O extends ObjectWithoutPaths
  ? O
  : D extends ObjectTypeEntry<any, any>
  ? P extends D['path']
    ? D['type']
    : never
  : unknown;
