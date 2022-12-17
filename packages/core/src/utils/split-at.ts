export function splitAt<A extends string | unknown[]>(
  index: number,
  array: A,
): [A, A] {
  return [array.slice(0, index) as A, array.slice(index) as A];
}
