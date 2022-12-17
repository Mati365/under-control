import { GetAllObjectPaths, GetPathObjectType } from '../../types';
import { getFlattenPathParts } from './get-flatten-path-parts';
import { ObjectWithPaths } from './is-object-with-paths';

export function setByPath<
  O extends ObjectWithPaths,
  K extends GetAllObjectPaths<O>,
>(path: K, value: GetPathObjectType<O, K>, obj: O): O {
  const flattenParts = getFlattenPathParts(path as string);
  const reducedObj: any = Array.isArray(obj) ? [...obj] : { ...obj };

  let previousObj = reducedObj;

  for (let i = 0; i < flattenParts.length; ++i) {
    const part = flattenParts[i];

    if (part === null) {
      continue;
    }

    if (i === flattenParts.length - 1) {
      previousObj[part] = value;
    } else {
      if (!(part in previousObj)) {
        if (typeof flattenParts[i + 1] === 'number') {
          previousObj[part] = [];
        } else {
          previousObj[part] = {};
        }
      }

      previousObj = previousObj[part];
    }
  }

  return reducedObj as O;
}
