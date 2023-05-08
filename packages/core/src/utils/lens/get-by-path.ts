import { GetAllObjectPaths, GetPathObjectType } from '../../types';
import { getFlattenPathParts } from './get-flatten-path-parts';
import { ObjectWithPaths } from '../../types/object-with-paths';

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

    reducedObj = reducedObj[part];

    if (reducedObj === null) {
      if (i + 2 < flattenParts.length) {
        return undefined;
      }

      return reducedObj;
    }

    if (typeof reducedObj === 'undefined') {
      break;
    }
  }

  return reducedObj;
}
