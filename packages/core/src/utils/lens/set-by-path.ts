import type { GetAllObjectPaths, GetPathObjectType } from '../../types';
import type { ObjectWithPaths } from '../../types/object-with-paths';

import { getFlattenPathParts } from './get-flatten-path-parts';

export function setByPath<
  O extends ObjectWithPaths,
  K extends GetAllObjectPaths<O>,
>(path: K, value: GetPathObjectType<O, K>, obj: O): O {
  const flattenParts = getFlattenPathParts(path);

  const lookupAndSet = (pathIndex: number, nestedObj: any): any => {
    const firstPathPart = flattenParts[pathIndex];

    if (pathIndex === flattenParts.length) {
      return value;
    }

    if (firstPathPart === null) {
      return lookupAndSet(pathIndex + 1, nestedObj);
    }

    if (Array.isArray(nestedObj) || typeof firstPathPart === 'number') {
      const clone = Array.isArray(nestedObj) ? [...nestedObj] : [];
      clone[+firstPathPart] = lookupAndSet(
        pathIndex + 1,
        clone[+firstPathPart],
      );
      return clone;
    }

    if (typeof nestedObj === 'object' || typeof firstPathPart === 'string') {
      const clone = typeof nestedObj === 'object' ? { ...nestedObj } : {};
      clone[firstPathPart] = lookupAndSet(pathIndex + 1, clone[firstPathPart]);
      return clone;
    }
  };

  return lookupAndSet(0, obj);
}
