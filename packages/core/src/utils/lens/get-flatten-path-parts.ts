import { tryDecodePathArrayItem } from './try-decode-path-array-item';

type FlattenPathPart = string | number | null;

export function getFlattenPathParts(path: string): FlattenPathPart[] {
  return path.split('.').flatMap(part => {
    const array = tryDecodePathArrayItem(part);
    if (array !== null) {
      return [array.field, ...array.indices];
    }

    return part;
  });
}
