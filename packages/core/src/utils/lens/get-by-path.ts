import { GetAllObjectPaths, GetPathObjectType } from '../../types';
import { getFlattenPathParts } from './get-flatten-path-parts';
import { ObjectWithPaths } from './is-object-with-paths';

export function getByPath<
  O extends ObjectWithPaths,
  K extends GetAllObjectPaths<O>,
>(path: K, obj: O): GetPathObjectType<O, K> | undefined {
  const flattenParts = getFlattenPathParts(path);
  let reducedObj: any = obj;

  for (const part of flattenParts) {
    if (part === null) {
      continue;
    }

    reducedObj = reducedObj[part];
    if (typeof reducedObj === 'undefined') {
      break;
    }
  }

  return reducedObj;
}
