import type { GetAllObjectPaths, GetPathObjectType } from '../../types';
import type { ObjectWithPaths } from '../../types/object-with-paths';

import { getFlattenPathParts } from './get-flatten-path-parts';

export function getByPath<
  O extends ObjectWithPaths,
  K extends GetAllObjectPaths<O>,
>(path: K, obj: O): GetPathObjectType<O, K> | undefined {
  const flattenParts = getFlattenPathParts(path);
  let reducedObj: any = obj;

  for (let i = 0; i < flattenParts.length; ++i) {
    const part = flattenParts[i];

    if (part === null) {
      continue;
    }

    if (typeof reducedObj === 'undefined') {
      break;
    }

    reducedObj = reducedObj?.[part];

    if (reducedObj === null) {
      if (i + 1 === flattenParts.length) {
        return reducedObj;
      }

      return undefined;
    }
  }

  return reducedObj;
}
