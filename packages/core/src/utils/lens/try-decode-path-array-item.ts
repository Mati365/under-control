import { Nullable } from '../../types';
import { splitAt } from '../split-at';

type ArrayFieldIndex = {
  field: string | null;
  indices: number[];
};

export function tryDecodePathArrayItem(
  part: string,
): Nullable<ArrayFieldIndex> {
  if (!part.includes('[') || !part.endsWith(']')) {
    return null;
  }

  const [field, rest] = splitAt(part.indexOf('['), part);
  const indices = rest
    .slice(1)
    .split('][')
    .map(index => Number.parseInt(index, 10));

  return {
    field: field === '' ? null : field,
    indices,
  };
}
