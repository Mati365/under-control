import type { ObjectWithPaths } from '../types/object-with-paths';

export function isObjectWithPaths(obj: any): obj is ObjectWithPaths {
  return Array.isArray(obj) || typeof obj === 'object';
}
