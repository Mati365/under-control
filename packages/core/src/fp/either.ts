export type Left<E> = {
  readonly _tag: 'Left';
  readonly left: E;
};

export type Right<A> = {
  readonly _tag: 'Right';
  readonly right: A;
};

export type Either<E, A> = Left<E> | Right<A>;

export const right = <A = never, E = never>(val: A): Either<E, A> => ({
  _tag: 'Right',
  right: val,
});

export const left = <A = never, E = never>(val: E): Either<E, A> => ({
  _tag: 'Left',
  left: val,
});

export const match = <E, A, B>(
  e: Either<E, A>,
  onLeft: (e: E) => B,
  onRight: (a: A) => B,
): B => (e._tag === 'Left' ? onLeft(e.left) : onRight(e.right));
